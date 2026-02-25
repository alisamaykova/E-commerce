import axios from 'axios';

const api = axios.create({
  baseURL: 'https://front-school-strapi.ktsdev.ru/api',
});

export async function registerTestUser() {
  try {
    const { data } = await api.post('/auth/local/register', {
      username: 'AliceUser_',
      email: 'alisa.d.example@test.com',
      password: '123456',
    });

    localStorage.setItem('jwt', data.jwt);
    console.log('JWT получен через регистрацию');
    return data.jwt;
  } catch (error) {
    console.log('Регистрация не удалась, пробуем логин');
    return loginTestUser();
  }
}

export async function loginTestUser() {
  try {
    const { data } = await api.post('/auth/local', {
      identifier: 'alisa.d.example@test.com',
      password: '123456',
    });

    localStorage.setItem('jwt', data.jwt);
    console.log('JWT получен через логин');
    return data.jwt;
  } catch (error) {
    console.error('Логин тоже не удался:', error);
    throw error;
  }
}

export async function addToCart(productId: number) {
  const jwt = localStorage.getItem('jwt');

  if (!jwt) {
    throw new Error('Нет токена. Сначала выполните register или login.');
  }

  return api.post(
    '/cart/add',
    { product: productId, quantity: 1 },
    { headers: { Authorization: `Bearer ${jwt}` } }
  );
}
