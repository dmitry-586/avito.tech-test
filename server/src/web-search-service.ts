import type { SuggestPriceInput } from './validation.ts';

const WEB_SEARCH_ENABLED = process.env.WEB_SEARCH_ENABLED?.trim() !== 'false';
const WEB_SEARCH_TIMEOUT_MS = Number(process.env.WEB_SEARCH_TIMEOUT_MS ?? 10_000);
const WEB_SEARCH_RESULTS_LIMIT = Number(process.env.WEB_SEARCH_RESULTS_LIMIT ?? 6);
const WEB_SEARCH_PAGE_FETCH_LIMIT = Number(process.env.WEB_SEARCH_PAGE_FETCH_LIMIT ?? 2);

type SearchResult = {
  title: string;
  url: string;
  snippet: string;
};

export type MarketResearchContext = {
  query: string;
  searchedAt: string;
  provider: 'duckduckgo';
  results: SearchResult[];
  priceSignalsRub: number[];
};

const DDG_URL = 'https://duckduckgo.com/html/';
const JINA_URL = 'https://r.jina.ai/';

const limit = (value: number, fallback: number, max = 10): number => {
  if (!Number.isFinite(value) || value <= 0) {
    return fallback;
  }

  return Math.min(Math.max(1, Math.floor(value)), max);
};

const withTimeout = async <T>(
  timeoutMs: number,
  fn: (signal: AbortSignal) => Promise<T>,
): Promise<T> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fn(controller.signal);
  } finally {
    clearTimeout(timer);
  }
};

const cleanHtml = (value: string): string =>
  value
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();

const decodeDuckDuckGoUrl = (rawUrl: string): string => {
  const normalized = rawUrl.startsWith('//') ? `https:${rawUrl}` : rawUrl;

  try {
    const parsed = new URL(normalized);
    const redirected = parsed.searchParams.get('uddg');
    return redirected ? decodeURIComponent(redirected) : normalized;
  } catch {
    return normalized;
  }
};

const buildQuery = (input: SuggestPriceInput): string => {
  if (input.category === 'auto') {
    return [
      input.params.brand ?? input.title,
      input.params.model ?? '',
      input.params.yearOfManufacture?.toString() ?? '',
      '\u0446\u0435\u043d\u0430',
      '\u0431/\u0443',
      '\u0433\u0440\u0443\u0437\u043e\u0432\u0438\u043a',
      'site:avito.ru',
    ]
      .filter(Boolean)
      .join(' ');
  }

  return [input.title, '\u0446\u0435\u043d\u0430', '\u0431/\u0443', 'site:avito.ru']
    .filter(Boolean)
    .join(' ');
};

const searchDuckDuckGo = async (query: string): Promise<SearchResult[]> =>
  withTimeout(WEB_SEARCH_TIMEOUT_MS, async signal => {
    const params = new URLSearchParams({
      q: query,
      kl: 'ru-ru',
      kp: '-2',
    });

    const response = await fetch(`${DDG_URL}?${params.toString()}`, {
      signal,
      headers: {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      return [];
    }

    const html = await response.text();
    const pattern =
      /<a[^>]*class="result__a"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?<a[^>]*class="result__snippet"[^>]*>([\s\S]*?)<\/a>/g;

    const results: SearchResult[] = [];
    const maxResults = limit(WEB_SEARCH_RESULTS_LIMIT, 6);

    for (const match of html.matchAll(pattern)) {
      const title = cleanHtml(match[2]);
      const url = decodeDuckDuckGoUrl(match[1]);
      const snippet = cleanHtml(match[3]);

      if (!title || !url) {
        continue;
      }

      results.push({ title, url, snippet });
      if (results.length >= maxResults) {
        break;
      }
    }

    return results;
  }).catch(() => []);

const isPublicHttpUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();

    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return false;
    }

    if (host === 'localhost' || host === '127.0.0.1' || host === '::1') {
      return false;
    }

    return true;
  } catch {
    return false;
  }
};

const fetchPageText = async (url: string): Promise<string> => {
  if (!isPublicHttpUrl(url)) {
    return '';
  }

  return withTimeout(WEB_SEARCH_TIMEOUT_MS, async signal => {
    const response = await fetch(`${JINA_URL}${url}`, {
      signal,
      headers: {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      return '';
    }

    return (await response.text()).slice(0, 50_000);
  }).catch(() => '');
};

const parseRubPrice = (raw: string): number | null => {
  const value = Number.parseInt(raw.replace(/[ \u00a0]/g, ''), 10);

  if (!Number.isFinite(value)) {
    return null;
  }

  if (value < 10_000 || value > 50_000_000) {
    return null;
  }

  return value;
};

const extractRubPrices = (text: string): number[] => {
  const values: number[] = [];
  const normalized = text.toLowerCase();

  const currencyPattern =
    /(\d{1,3}(?:[ \u00a0]\d{3}){1,3}|\d{4,8})\s*(?:\u20bd|(?:\u0440\u0443\u0431(?:\.|\u043b\u044f|\u043b\u0435\u0439)?))/giu;
  for (const match of normalized.matchAll(currencyPattern)) {
    const parsed = parseRubPrice(match[1]);
    if (parsed !== null) {
      values.push(parsed);
    }
  }

  return [...new Set(values)].sort((left, right) => left - right);
};

const anchorPrices = (prices: number[], inputPrice?: number | null): number[] => {
  if (!prices.length) {
    return prices;
  }

  if (!inputPrice || inputPrice <= 0) {
    return prices;
  }

  const minBound = Math.round(inputPrice * 0.65);
  const maxBound = Math.round(inputPrice * 1.6);
  const anchored = prices.filter(price => price >= minBound && price <= maxBound);

  return anchored;
};

export const getMarketResearchContext = async (
  input: SuggestPriceInput,
): Promise<MarketResearchContext | null> => {
  if (!WEB_SEARCH_ENABLED) {
    return null;
  }

  const query = buildQuery(input);
  const results = await searchDuckDuckGo(query);
  if (!results.length) {
    return null;
  }

  const pageFetchLimit = limit(WEB_SEARCH_PAGE_FETCH_LIMIT, 2, 4);
  const pageTexts = await Promise.all(
    results.slice(0, pageFetchLimit).map(result => fetchPageText(result.url)),
  );

  const sourceText = [
    ...results.map(result => `${result.title}. ${result.snippet}`),
    ...pageTexts.filter(Boolean),
  ].join('\n');

  const extracted = extractRubPrices(sourceText);
  const priceSignalsRub = anchorPrices(extracted, input.price);

  return {
    query,
    searchedAt: new Date().toISOString(),
    provider: 'duckduckgo',
    results: results.slice(0, limit(WEB_SEARCH_RESULTS_LIMIT, 6)),
    priceSignalsRub,
  };
};
