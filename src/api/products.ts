import axios from 'axios';
import qs from 'qs';

const BASE_URL = 'https://front-school-strapi.ktsdev.ru/api';

const API_TOKEN = '';

export const getProducts = async (page: number=1, pageSize: number = 9) => {
  const query = qs.stringify({
    populate: ['images', 'productCategory'],
    pagination: {
      page,
      pageSize,
    },
  },
    { encodeValuesOnly: true }
  );

  const response = await axios.get(`${BASE_URL}/products?${query}`, {
    headers: { Authorization: `Bearer ${API_TOKEN}` },
  });

  return response.data;

};

export const getProductById = async (documentId:string) => {
  const query = qs.stringify(
    {
      populate: ['images', 'productCategory'],
    },
    {encodeValuesOnly:true}
  );

  const response = await axios.get(`${BASE_URL}/products/${documentId}?${query}`, {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
    },
  });
  return response.data;
}
