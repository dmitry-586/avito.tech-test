import type { MarketResearchContext } from './web-search-service.ts';
import type { ImproveDescriptionInput, SuggestPriceInput } from './validation.ts';

const toPromptValue = (value: string | number | null | undefined): string => {
  if (value === undefined || value === null) {
    return 'null';
  }

  return String(value);
};

const serializeInput = (
  input: ImproveDescriptionInput | SuggestPriceInput,
): string[] => [
  '<input>',
  `category=${input.category}`,
  `title=${toPromptValue(input.title)}`,
  `price=${toPromptValue(input.price)}`,
  `description=${toPromptValue(input.description)}`,
  `params=${JSON.stringify(input.params)}`,
  '</input>',
];

const serializeAllowedFacts = (
  input: ImproveDescriptionInput | SuggestPriceInput,
): string[] => {
  const lines: string[] = [
    '<allowed_facts>',
    `category=${input.category}`,
    `title=${toPromptValue(input.title)}`,
  ];

  if (input.price !== undefined && input.price !== null) {
    lines.push(`price=${input.price}`);
  }
  if (input.description) {
    lines.push(`description=${input.description}`);
  }

  for (const [key, value] of Object.entries(input.params)) {
    if (value !== undefined && value !== null) {
      lines.push(`param.${key}=${String(value)}`);
    }
  }

  lines.push('</allowed_facts>');
  return lines;
};

const extractProtectedTokens = (
  input: ImproveDescriptionInput | SuggestPriceInput,
): string[] => {
  const raw = [input.title];

  if ('brand' in input.params && typeof input.params.brand === 'string') {
    raw.push(input.params.brand);
  }
  if ('model' in input.params && typeof input.params.model === 'string') {
    raw.push(input.params.model);
  }

  const tokens = raw.flatMap(value => value.match(/[A-Za-z][A-Za-z0-9-]*/g) ?? []);
  return [...new Set(tokens)];
};

const extractAllowedNumberTokens = (
  input: ImproveDescriptionInput | SuggestPriceInput,
): string[] => {
  const bag: string[] = [input.title];
  if (input.description) {
    bag.push(input.description);
  }
  if (typeof input.price === 'number') {
    bag.push(String(input.price));
  }
  for (const value of Object.values(input.params)) {
    if (value !== undefined && value !== null) {
      bag.push(String(value));
    }
  }

  const numbers = bag.flatMap(value => value.match(/\d+(?:[.,]\d+)?/g) ?? []);
  return [...new Set(numbers)];
};

const buildMarketResearchBlock = (
  context?: MarketResearchContext | null,
): string[] => {
  if (!context) {
    return ['<market_research>', 'status=not_available', '</market_research>'];
  }

  const lines = [
    '<market_research>',
    'status=available',
    `provider=${context.provider}`,
    `searchedAt=${context.searchedAt}`,
    `query=${context.query}`,
    `priceSignalsCount=${context.priceSignalsRub.length}`,
    `priceSignalsRub=${context.priceSignalsRub.join(',')}`,
    'topResults:',
  ];

  for (const [index, result] of context.results.slice(0, 5).entries()) {
    lines.push(
      `${index + 1}. title="${result.title}" url="${result.url}" snippet="${result.snippet}"`,
    );
  }

  lines.push('</market_research>');
  return lines;
};

export const buildImproveDescriptionPrompt = (
  input: ImproveDescriptionInput,
): string => {
  const protectedTokens = extractProtectedTokens(input);
  const allowedNumbers = extractAllowedNumberTokens(input);

  return [
    'Ты редактор объявлений для российского маркетплейса.',
    'Верни только один валидный JSON-объект и ничего больше.',
    'Точный формат:',
    '{"message":"..."}',
    'Жесткие правила:',
    '1) Пиши только на русском языке.',
    '2) Латиница допустима только для защищенных токенов (бренд/модель/название).',
    `3) Защищенные токены: ${protectedTokens.join(', ') || 'нет'}.`,
    '4) Нельзя выдумывать характеристики. Если факта нет во входе — прямо скажи, что параметр не указан.',
    `5) Разрешенные числовые значения: ${allowedNumbers.join(', ') || 'нет'}. Не добавляй другие числа.`,
    '6) Никаких английских фраз, транслита и искусственных терминов.',
    '7) Никаких контактов, ссылок и манипулятивных фраз.',
    '8) Прямо запрещены формулировки: "по телефону", "звоните", "пишите", "в личку".',
    '9) Не используй общие заглушки без смысла и канцелярит.',
    '10) Стиль: естественный, деловой, информативный, плотный по смыслу, без воды.',
    '11) Длина message: 750-1300 символов.',
    '12) Минимум 8 полноценных предложений.',
    '13) Обязательная структура message (4 абзаца, разделяй пустой строкой):',
    '    абзац 1: что продается, ключевая ценность и контекст;',
    '    абзац 2: подтвержденные параметры и характеристики только из входа;',
    '    абзац 3: состояние/ограничения/что не указано и что стоит уточнить;',
    '    абзац 4: цена и спокойное завершение без контактов.',
    '14) В каждом абзаце должно быть минимум 2 предложения.',
    '15) В абзаце 3 перечисли минимум 3 неуказанных параметра, которые важно уточнить перед покупкой.',
    '16) Если входных фактов мало, расширяй текст через пользу для покупателя и список уточнений, а не через новые технические характеристики.',
    '17) Пиши только в логике продажи: это объявление продавца, а не запрос покупателя.',
    '18) Прямо запрещены формулировки спроса: "куплю", "ищу", "нужен", "приобрету", "рассмотрю покупку".',
    '19) Даже если во входном тексте встречается формулировка спроса, преобразуй ее в корректную форму продажи без потери фактов.',
    '20) Перед отправкой проверь себя: если нарушено хоть одно правило, перепиши ответ заново.',
    ...serializeInput(input),
    ...serializeAllowedFacts(input),
  ].join('\n');
};

export const buildSuggestPricePrompt = (
  input: SuggestPriceInput,
  marketResearch?: MarketResearchContext | null,
): string => {
  const protectedTokens = extractProtectedTokens(input);
  const allowedNumbers = extractAllowedNumberTokens(input);

  return [
    'Ты оцениваешь цену объявления для российского маркетплейса.',
    'Верни только один валидный JSON-объект и ничего больше.',
    'Точный формат:',
    '{"message":"..."}',
    'Жесткие правила:',
    '1) Пиши только на русском языке.',
    '2) Латиница допустима только для защищенных токенов.',
    `3) Защищенные токены: ${protectedTokens.join(', ') || 'нет'}.`,
    '4) Формат текста внутри message:',
    '   "Рекомендованная цена: <число> ₽. Диапазон: <число>-<число> ₽. Уверенность: <низкая|средняя|высокая>. Обоснование: <ровно 4 предложения>."',
    '5) Структура 4 предложений в обосновании обязательна:',
    '   1-е: связь с входной ценой; 2-е: что видно по market_research; 3-е: ограничение/риск оценки; 4-е: финальный вывод.',
    '6) Последнее предложение обоснования должно начинаться с "Итог:" и звучать естественно, без шаблонов.',
    '7) Уверенность указывай только один раз: в блоке "Уверенность: ...". В обосновании не повторяй этот термин.',
    '8) Если priceSignalsCount < 3, Уверенность может быть только "низкая".',
    '9) Если рыночных сигналов мало или они противоречивы, объясни это явно.',
    '10) Если входной price есть, используй его как якорь и отклоняйся только при явной причине.',
    '11) Не добавляй технические факты об объекте, которых нет во входе.',
    `12) Разрешенные числа из входа: ${allowedNumbers.join(', ') || 'нет'}. Новые числа допустимы только для ценовой рекомендации и диапазона.`,
    '13) Не используй мусорные формулировки и канцелярит.',
    '14) Прямо запрещены формулировки: "предложений ограничено", "количество ограничено", "есть несколько предложений".',
    '15) Никаких английских предложений и транслита.',
    '16) Нельзя упоминать официальных дилеров, автосалоны и розничные каналы, если этого нет прямо во входе и market_research.',
    '17) Не используй язык покупателя и спроса ("куплю", "ищу", "нужен", "приобрету").',
    '18) Длина message: 450-850 символов.',
    '19) Перед отправкой проверь себя: если нарушено хоть одно правило, перепиши ответ заново.',
    ...serializeInput(input),
    ...serializeAllowedFacts(input),
    ...buildMarketResearchBlock(marketResearch),
  ].join('\n');
};
