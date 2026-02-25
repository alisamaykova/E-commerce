import { makeAutoObservable, runInAction } from 'mobx';

import { addToCart as apiAddToCart } from '../api/auth';
import { getCart, removeFromCart } from '../api/cart';
import type { CartItem } from '../api/cart';

export class CartStore {
  items: CartItem[] = [];
  loading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
    this.loadCart();
  }

  async loadCart() {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      return;
    }

    this.loading = true;
    this.error = null;
    try {
      const data = await getCart();
      runInAction(() => {
        this.items = data;
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
        this.error = error instanceof Error ? error.message : 'Failed to load cart';
      });
    }
  }

  async addItem(productId: number) {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      this.error = 'No JWT found. Please login first.';
      return;
    }

    this.loading = true;
    try {
      await apiAddToCart(productId);
      await this.loadCart();
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Failed to add item';
        this.loading = false;
      });
    }
  }

  async removeItem(productId: number, quantity = 1) {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      this.error = 'No JWT found. Please login first.';
      return;
    }

    this.loading = true;
    try {
      await removeFromCart(productId, quantity);
      await this.loadCart();
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Failed to remove item';
        this.loading = false;
      });
    }
  }

  get totalItems(): number {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  get totalPrice(): number {
    return this.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }
}
