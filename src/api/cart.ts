import type { CartItem } from '../types/cart';

import { call } from './call';

export const getCart = async (): Promise<CartItem[]> => {
  const response = await call<CartItem[]>({
    endpoint: '/cart',
    method: 'GET',
    params: {
      populate: ['product.images'],
    },
    withAuth: true,
  });

  if (response.isError) {
    throw new Error(response.error || 'Failed to load cart');
  }

  return response.data || [];
};

export const addToCart = async (productId: number, quantity = 1) => {
  const response = await call({
    endpoint: '/cart/add',
    method: 'POST',
    data: { product: productId, quantity },
    withAuth: true,
  });

  if (response.isError) {
    throw new Error(response.error || 'Failed to add item');
  }

  return response.data;
};

export const removeFromCart = async (productId: number, quantity = 1) => {
  const response = await call({
    endpoint: '/cart/remove',
    method: 'POST',
    data: { product: productId, quantity },
    withAuth: true,
  });

  if (response.isError) {
    throw new Error(response.error || 'Failed to remove item');
  }

  return response.data;
};
