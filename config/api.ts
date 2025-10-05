export const API_CONFIG = {
  BASE_URL: 'https://swapi.dev/api',
  ENDPOINTS: {
    PRODUCTS: '/starships',
    PRODUCT_BY_NAME: (name: string) => `/starships/?search=${name}`,
  }
};
