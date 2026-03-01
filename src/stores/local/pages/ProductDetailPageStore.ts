import { makeAutoObservable, runInAction } from 'mobx';

import { getProductById } from '../../../api/products';
import type { Product } from '../../../types/Product';
import { MetaStore } from '../../shared/MetaStore';

export class ProductDetailPageStore {
  product: Product | null = null;
  productMeta = new MetaStore();

  constructor() {
    makeAutoObservable(this);
  }

  async loadProduct(documentId: string) {
    if (!documentId) return;

    this.productMeta.setLoadedStartMeta();

    const response = await getProductById(documentId);

    if (response.isError) {
      this.productMeta.setLoadedErrorMeta(response.error || 'Failed to load product');
      return;
    }

    runInAction(() => {
      this.product = response.data?.data || null;
      this.productMeta.setLoadedSuccessMeta();
    });
  }

  destroy() {
    this.productMeta.resetMeta();
    this.product = null;
  }
}
