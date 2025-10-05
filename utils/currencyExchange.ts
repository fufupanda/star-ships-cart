export const EXCHANGE_RATE_ONE_AED = 10000;

export const getCurrencyConversion = (credits: number, exchangeRate: number) => {
  return credits / exchangeRate;
};
