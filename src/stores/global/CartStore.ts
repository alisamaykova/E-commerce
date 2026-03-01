import { makeObservable, observable, action, runInAction } from 'mobx';
import type { ProductImage } from 'types/Product';

import { call } from '../../api/call';
import { MetaStore } from '../shared/MetaStore';

import type { RootStore } from './RootStore';

export type CartItem = {
  id: number;
  product: {
    id: number;
    title: string;
    price: number;
    images?: ProductImage[];
  };
  quantity: number;
};

type PrivateFields = '_loadCart' | '_addItemRequest' | '_removeItemRequest';

export class CartStore {
  items: CartItem[] = [];
  cartMeta = new MetaStore();
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeObservable<this, PrivateFields>(this, {
      items: observable,
      cartMeta: observable,
      _loadCart: action.bound,
      _addItemRequest: action.bound,
      _removeItemRequest: action.bound,
      loadCart: action.bound,
      addItem: action.bound,
      removeItem: action.bound,
    });
  }

  private async _loadCart() {
    this.cartMeta.setLoadedStartMeta();

    const response = await call<CartItem[]>({
      endpoint: '/cart',
      method: 'GET',
      withAuth: true,
    });

    if (response.isError) {
      this.cartMeta.setLoadedErrorMeta(response.error || 'Failed to load cart');
      return;
    }

    const items = response.data || [];
    runInAction(() => {
      this.items = items;
      this.cartMeta.setLoadedSuccessMeta();
    });
  }

  private async _addItemRequest(productId: number) {
    return await call({
      endpoint: '/cart/add',
      method: 'POST',
      data: { product: productId, quantity: 1 },
      withAuth: true,
    });
  }

  private async _removeItemRequest(productId: number, quantity: number) {
    return await call({
      endpoint: '/cart/remove',
      method: 'POST',
      data: { product: productId, quantity },
      withAuth: true,
    });
  }

  async loadCart() {
    await this._loadCart();
  }

  async addItem(productId: number) {
    this.cartMeta.setLoadedStartMeta();

    const response = await this._addItemRequest(productId);

    if (response.isError) {
      this.cartMeta.setLoadedErrorMeta(response.error || 'Failed to add item');
      return;
    }

    await this._loadCart();
  }

  async removeItem(productId: number, quantity = 1) {
    this.cartMeta.setLoadedStartMeta();

    const response = await this._removeItemRequest(productId, quantity);

    if (response.isError) {
      this.cartMeta.setLoadedErrorMeta(response.error || 'Failed to remove item');
      return;
    }

    await this._loadCart();
  }

  get totalItems(): number {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  get totalPrice(): number {
    return this.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }
}
