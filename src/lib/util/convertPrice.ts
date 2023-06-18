enum CurrencyConversions {
  'eur' = 5,
  'pln' = 1
}

export type Currency = keyof typeof CurrencyConversions;

export function convertPrice(currency: Currency, number: number) {
  return (number / CurrencyConversions[currency]).toFixed(2) + currency.toUpperCase();
}
