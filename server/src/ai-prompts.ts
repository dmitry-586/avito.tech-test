import type { ImproveDescriptionInput, SuggestPriceInput } from './validation.ts';

const toPromptValue = (value: string | number | null | undefined): string => {
  if (value === undefined || value === null) {
    return 'null';
  }

  return String(value);
};

const serializeInputBlock = (
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

export const buildImproveDescriptionPrompt = (input: ImproveDescriptionInput): string =>
  [
    'Ты — помощник продавца на маркетплейсе. Пиши только на русском.',
    'Задача: переписать описание объявления так, чтобы оно было полезным, честным и конкретным.',
    'Верни только валидный JSON без markdown и без дополнительного текста.',
    'Точный формат ответа:',
    '{"description":"..."}',
    'Жесткие правила:',
    '1) Длина description от 400 до 900 символов.',
    '2) Только факты из входа. Не выдумывай характеристики, историю использования или документы.',
    '3) Никаких контактов, ссылок, просьб написать в личку и маркетинговых штампов.',
    '4) Структура внутри текста: (а) что продается и преимущества, (б) состояние/комплектация/детали, (в) условия передачи.',
    '5) Если данных не хватает, прямо укажи это в описании нейтральной фразой, но ничего не выдумывай.',
    'Проверка перед ответом:',
    '- Ответ должен быть одним JSON-объектом.',
    '- Ключ строго один: description.',
    '- Экранируй кавычки в тексте корректно, чтобы JSON.parse прошел без ошибок.',
    ...serializeInputBlock(input),
  ].join('\n');

export const buildSuggestPricePrompt = (input: SuggestPriceInput): string =>
  [
    'Ты — помощник по оценке цены объявления. Пиши только на русском.',
    'У тебя нет доступа к интернету: оценка должна быть эвристической, только по входным данным.',
    'Верни только валидный JSON без markdown и без дополнительного текста.',
    'Точный формат ответа:',
    '{"suggestedPrice":12345,"priceMin":10000,"priceMax":14000,"reason":"...","confidence":"low"}',
    'Жесткие правила:',
    '1) Все цены — целые числа > 0.',
    '2) Всегда соблюдай: priceMin <= suggestedPrice <= priceMax.',
    '3) reason: 2-4 предложения, объясни факторы оценки и ограничения по данным, без выдумок.',
    '4) confidence только одно из: low, medium, high.',
    '5) Если данных мало, обязательно confidence=low и широкий диапазон (priceMax заметно выше priceMin).',
    '6) Если входной price есть, используй его как ориентир, но можешь корректировать по описанию/параметрам.',
    'Проверка перед ответом:',
    '- Ответ должен быть одним JSON-объектом.',
    '- Используй только ключи: suggestedPrice, priceMin, priceMax, reason, confidence.',
    '- Экранируй кавычки в reason корректно, чтобы JSON.parse прошел без ошибок.',
    ...serializeInputBlock(input),
  ].join('\n');
