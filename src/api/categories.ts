import axios from 'axios';

import type { Option } from '../components/MultiDropdown/MultiDropdown';

const BASE_URL = 'https://front-school-strapi.ktsdev.ru/api';

export const getCategories = async (): Promise<Option[]> => {
  const response = await axios.get(`${BASE_URL}/product-categories`);

  return response.data.data.map((cat: any) => ({
    key: String(cat.id),
    value: cat.title,
  }));
};
