import axios from 'axios';
import qs from 'qs';
import type { CartItem } from 'types/cart';

const BASE_URL = 'https://front-school-strapi.ktsdev.ru/api';

const getAuthHeaders = () => {
  const jwt = localStorage.getItem('jwt');
  if (!jwt) {
    throw new Error('No JWT found. Please login first.');
  }
  return { Authorization: `Bearer ${jwt}` };
};

export const getCart = async (): Promise<CartItem[]> => {
  const query = qs.stringify(
    {
      populate: ['product.images'],
    },
    { encodeValuesOnly: true }
  );
  const response = await axios.get(`${BASE_URL}/cart?${query}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const addToCart = async (productId: number, quantity = 1) => {
  const response = await axios.post(
    `${BASE_URL}/cart/add`,
    { product: productId, quantity },
    { headers: getAuthHeaders() }
  );
  return response.data;
};

export const removeFromCart = async (productId: number, quantity = 1) => {
  const response = await axios.post(
    `${BASE_URL}/cart/remove`,
    { product: productId, quantity },
    { headers: getAuthHeaders() }
  );
  return response.data;
};
