import type { Option } from '../components/MultiDropdown/MultiDropdown';
import type { Product } from '../types/Product';

import { call } from './call';

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

  const params: Record<string, any> = {
    populate: ['images', 'productCategory'],
    pagination: { page, pageSize },
  };

  if (Object.keys(filters).length > 0) {
    params.filters = filters;
  }

  return call<{ data: Product[]; meta: { pagination: { total: number; pageCount: number } } }>({
    endpoint: '/products',
    method: 'GET',
    params,
    withAuth: false,
  });
};

export const getProductById = async (documentId: string) => {
  return call<{ data: Product }>({
    endpoint: `/products/${documentId}`,
    method: 'GET',
    params: {
      populate: ['images', 'productCategory'],
    },
    withAuth: false,
  });
};
