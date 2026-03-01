import type { RootStore } from './stores';

export const initAuth = async (store: RootStore) => {
  if (store.authStore.isAuthenticated) {
    await store.cartStore.loadCart();
    return;
  }

  const registerResult = await store.authStore.register(
    'TestUser',
    `test${Date.now()}@example.com`,
    'Test123456!'
  );

  if (!registerResult.isError) {
    console.log('✅ Регистрация успешна');
    await store.cartStore.loadCart();
    return;
  }

  console.log('⚠️ Регистрация не удалась, пробуем логин');
  const loginResult = await store.authStore.login('testuser@example.com', 'Test123456!');

  if (!loginResult.isError) {
    console.log('✅ Логин успешен');
    await store.cartStore.loadCart();
  } else {
    console.error('❌ Ошибка авторизации', loginResult.error);
  }
};
