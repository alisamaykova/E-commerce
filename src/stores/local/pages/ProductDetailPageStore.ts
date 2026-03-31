import { makeObservable, observable, action, runInAction } from 'mobx';

import { call } from '../../../api/call';
import type { ILocalStore } from '../../../hooks/useLocalStore';
import type { Product } from '../../../types/Product';
import { MetaStore } from '../../shared/MetaStore';

type PrivateFields = '_loadProduct';

export class ProductDetailPageStore implements ILocalStore {
  product: Product | null = null;
  productMeta = new MetaStore();

  constructor() {
    makeObservable<this, PrivateFields>(this, {
      product: observable,
      productMeta: observable,
      _loadProduct: action.bound,
      destroy: action.bound,
    });
  }

  async loadProduct(documentId: string) {
    await this._loadProduct(documentId);
  }

  private async _loadProduct(documentId: string) {
    if (!documentId) return;

    this.productMeta.setLoadedStartMeta();

    const response = await call<{ data: Product }>({
      endpoint: `/products/${documentId}`,
      method: 'GET',
      params: {
        populate: ['images', 'productCategory'],
      },
      withAuth: false,
    });

    if (response.isError) {
      this.productMeta.setLoadedErrorMeta(response.error || 'Failed to load product');
      return;
    }

    if (!response.data) {
      this.productMeta.setLoadedErrorMeta('Product not found');
      return;
    }

    const product = response.data.data;
    runInAction(() => {
      this.product = product;
      this.productMeta.setLoadedSuccessMeta();
    });
  }

  destroy() {
    this.productMeta.resetMeta();
    this.product = null;
  }
}
