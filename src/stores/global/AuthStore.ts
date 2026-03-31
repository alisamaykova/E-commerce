import { makeObservable, observable, action, runInAction } from 'mobx';

import { call } from '../../api/call';

import type { RootStore } from './RootStore';

type PrivateFields = '_loginRequest' | '_registerRequest' | '_setToken';

export class AuthStore {
  token: string | null = null;
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeObservable<this, PrivateFields>(this, {
      token: observable,
      _loginRequest: action.bound,
      _registerRequest: action.bound,
      _setToken: action.bound,
      login: action.bound,
      register: action.bound,
      logout: action.bound,
    });
    this._loadTokenFromStorage();
    if (this.token) {
      this.rootStore.cartStore.loadCart();
    }
  }

  private _loadTokenFromStorage() {
    this.token = localStorage.getItem('jwt');
  }

  get authHeaders() {
    return this.token ? { Authorization: `Bearer ${this.token}` } : null;
  }

  get isAuthenticated() {
    return !!this.token;
  }

  private async _loginRequest(identifier: string, password: string) {
    return await call<{ jwt: string }>({
      endpoint: '/auth/local',
      method: 'POST',
      data: { identifier, password },
    });
  }

  private async _registerRequest(username: string, email: string, password: string) {
    return await call<{ jwt: string }>({
      endpoint: '/auth/local/register',
      method: 'POST',
      data: { username, email, password },
    });
  }

  private _setToken(token: string) {
    this.token = token;
    localStorage.setItem('jwt', token);
    this.rootStore.cartStore.loadCart();
  }

  async login(identifier: string, password: string) {
    const response = await this._loginRequest(identifier, password);
    if (!response.isError) {
      const data = response.data;
      if (data) {
        runInAction(() => {
          this._setToken(data.jwt);
        });
      }
    }
    return response;
  }

  async register(username: string, email: string, password: string) {
    const response = await this._registerRequest(username, email, password);
    if (!response.isError) {
      const data = response.data;
      if (data) {
        runInAction(() => {
          this._setToken(data.jwt);
        });
      }
    }
    return response;
  }
  logout() {
    this.token = null;
    localStorage.removeItem('jwt');
  }
}
