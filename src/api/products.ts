import axios from 'axios';
import type { Option } from 'components/MultiDropdown';
import qs from 'qs';

const BASE_URL = 'https://front-school-strapi.ktsdev.ru/api';

export const getProducts = async (
  page: number = 1,
  pageSize: number = 9,
  searchQuery: string = '',
  selectedCategories: Option[] = []
) => {
  const filters: any = {};
  if (searchQuery) {
    filters.title = { $containsi: searchQuery };
  }

  if (selectedCategories.length > 0) {
    filters.productCategory = {
      id: {
        $in: selectedCategories.map((cat) => Number(cat.key)),
      },
    };
  }
  const query = qs.stringify(
    {
      populate: ['images', 'productCategory'],
      pagination: {
        page,
        pageSize,
      },
      filters: Object.keys(filters).length > 0 ? filters : undefined,
    },
    { encodeValuesOnly: true }
  );

  const response = await axios.get(`${BASE_URL}/products?${query}`);

  return response.data;
};

export const getProductById = async (documentId: string) => {
  const query = qs.stringify(
    {
      populate: ['images', 'productCategory'],
    },
    { encodeValuesOnly: true }
  );

  const response = await axios.get(`${BASE_URL}/products/${documentId}?${query}`);
  return response.data;
};
