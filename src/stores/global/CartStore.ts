import { makeAutoObservable, runInAction } from 'mobx';

import { call } from '../../api/call';
import type { CartItem } from '../../types/cart';
import { MetaStore } from '../shared/MetaStore';

export class CartStore {
  items: CartItem[] = [];
  cartMeta = new MetaStore();

  get totalItems(): number {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  get totalPrice(): number {
    return this.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }

  constructor() {
    makeAutoObservable(this);
    this.loadCart();
  }

  async loadCart() {
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

    runInAction(() => {
      this.items = response.data || [];
      this.cartMeta.setLoadedSuccessMeta();
    });
  }

  async addItem(productId: number) {
    this.cartMeta.setLoadedStartMeta();

    const response = await call({
      endpoint: '/cart/add',
      method: 'POST',
      data: { product: productId, quantity: 1 },
      withAuth: true,
    });

    if (response.isError) {
      this.cartMeta.setLoadedErrorMeta(response.error || 'Failed to add item');
      return;
    }

    await this.loadCart();
  }

  async removeItem(productId: number, quantity = 1) {
    this.cartMeta.setLoadedStartMeta();

    const response = await call({
      endpoint: '/cart/remove',
      method: 'POST',
      data: { product: productId, quantity },
      withAuth: true,
    });

    if (response.isError) {
      this.cartMeta.setLoadedErrorMeta(response.error || 'Failed to remove item');
      return;
    }

    await this.loadCart();
  }
}
