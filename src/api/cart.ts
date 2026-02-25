import axios from 'axios';

const BASE_URL = 'https://front-school-strapi.ktsdev.ru/api';

const JWT = '';

export type CartItem = {
  id: number;
  product: {
    id: number;
    title: string;
    price: number;
    image?: string;
  };
  quantity: number;
};

export const getCart = async (): Promise<CartItem[]> => {
  console.log('JWT for cart:', localStorage.getItem('jwt'));
  const response = await axios.get(`${BASE_URL}/cart`, {
    headers: { Authorization: `Bearer ${JWT}` },
  });
  return response.data;
};

export const addToCart = async (productId: number, quantity = 1) => {
  const response = await axios.post(
    `${BASE_URL}/cart/add`,
    { product: productId, quantity },
    { headers: { Authorization: `Bearer ${JWT}` } }
  );
  return response.data;
};

export const removeFromCart = async (productId: number, quantity = 1) => {
  const response = await axios.post(
    `${BASE_URL}/cart/remove`,
    { product: productId, quantity },
    { headers: { Authorization: `Bearer ${JWT}` } }
  );
  return response.data;
};
