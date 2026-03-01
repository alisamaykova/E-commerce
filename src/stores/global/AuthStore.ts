import { makeAutoObservable, runInAction } from 'mobx';

import { call } from '../../api/call';

import type { RootStore } from './RootStore';

export class AuthStore {
  rootStore: RootStore;
  token: string | null = null;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);

    runInAction(() => {
      this.loadTokenFromStorage();
      if (this.token) {
        this.rootStore.cartStore.loadCart();
      }
    });
  }

  private loadTokenFromStorage() {
    this.token = localStorage.getItem('jwt');
  }

  get authHeaders() {
    return this.token ? { Authorization: `Bearer ${this.token}` } : null;
  }

  get isAuthenticated() {
    return !!this.token;
  }

  async login(identifier: string, password: string) {
    const response = await call<{ jwt: string }>({
      endpoint: '/auth/local',
      method: 'POST',
      data: { identifier, password },
    });

    if (!response.isError && response.data) {
      this.setToken(response.data.jwt);
    }
    return response;
  }

  async register(username: string, email: string, password: string) {
    const response = await call<{ jwt: string }>({
      endpoint: '/auth/local/register',
      method: 'POST',
      data: { username, email, password },
    });

    if (!response.isError && response.data) {
      this.setToken(response.data.jwt);
    }
    return response;
  }

  logout() {
    this.token = null;
    localStorage.removeItem('jwt');
  }

  private setToken(token: string) {
    this.token = token;
    localStorage.setItem('jwt', token);
    this.rootStore.cartStore.loadCart();
  }
}
