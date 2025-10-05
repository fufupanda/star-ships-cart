export const API_CONFIG = {
  BASE_URL: 'https://swapi.dev/api',
  ENDPOINTS: {
    PRODUCTS: '/starships',
    PRODUCT_BY_NAME: (name: string) => `/starships/?search=${name}`,
  }
};

export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

