enum CurrencyConversions {
  'eur' = 5,
  'pln' = 1
}

export type Currency = keyof typeof CurrencyConversions;

export function convertPrice(currency: Currency, number: number) {
  const str = (number / CurrencyConversions[currency]).toFixed(2) + '\xa0' + currency.toUpperCase();
  return str.replace(/(?<=\d)(?=(\d{3})+(?!\d))/g, ',');
}
