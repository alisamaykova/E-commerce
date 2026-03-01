import type { ILocalStore } from 'hooks/useLocalStore';
import { makeObservable, observable, action, runInAction, reaction } from 'mobx';
import type { IReactionDisposer } from 'mobx';

import { call } from '../../../api/call';
import type { Option } from '../../../components/MultiDropdown/MultiDropdown';
import type { Product } from '../../../types/Product';
import { MetaStore } from '../../shared/MetaStore';

type PrivateFields = '_loadProducts' | '_loadCategories' | '_applyFilterFromUrl' | '_updateUrl';

export class ProductListPageStore implements ILocalStore {
  products: Product[] = [];
  productsMeta = new MetaStore();
  page = 1;
  pageSize = 9;
  total = 0;
  pageCount = 1;
  searchQuery = '';
  categories: Option[] = [];
  selectedCategories: Option[] = [];

  private _queryParamsStore: any;
  private _reactionDisposer: IReactionDisposer | null = null;

  constructor(queryParamsStore: any) {
    this._queryParamsStore = queryParamsStore;

    makeObservable<this, PrivateFields>(this, {
      products: observable,
      productsMeta: observable,
      page: observable,
      total: observable,
      pageCount: observable,
      searchQuery: observable,
      categories: observable,
      selectedCategories: observable,
      _loadProducts: action.bound,
      _loadCategories: action.bound,
      _applyFilterFromUrl: action.bound,
      _updateUrl: action.bound,
      setPage: action.bound,
      applyFilter: action.bound,
      applySearch: action.bound,
      destroy: action.bound,
    });

    this._loadCategories().then(() => {
      this._applyFilterFromUrl();
      this._loadProducts();
    });

    this._reactionDisposer = reaction(
      () => [this.page, this.searchQuery, this.selectedCategories],
      () => this._loadProducts()
    );
  }

  private async _loadCategories() {
    const response = await call<{ data: Array<{ id: number; title: string }> }>({
      endpoint: '/product-categories',
      method: 'GET',
      withAuth: false,
    });

    if (!response.isError && response.data) {
      const categories = response.data.data.map((item) => ({
        key: String(item.id),
        value: item.title,
      }));
      runInAction(() => {
        this.categories = categories;
      });
    }
  }

  private _applyFilterFromUrl() {
    const categoryKeys = this._queryParamsStore.getArrayParam('categories');
    if (categoryKeys.length > 0 && this.categories.length > 0) {
      this.selectedCategories = this.categories.filter((cat) => categoryKeys.includes(cat.key));
    }
  }

  private async _loadProducts() {
    this.productsMeta.setLoadedStartMeta();

    const response = await call<{
      data: Product[];
      meta: { pagination: { total: number; pageCount: number } };
    }>({
      endpoint: '/products',
      method: 'GET',
      params: {
        populate: ['images', 'productCategory'],
        pagination: { page: this.page, pageSize: this.pageSize },
        filters: {
          ...(this.searchQuery ? { title: { $containsi: this.searchQuery } } : {}),
          ...(this.selectedCategories.length > 0
            ? {
                productCategory: { id: { $in: this.selectedCategories.map((c) => Number(c.key)) } },
              }
            : {}),
        },
      },
      withAuth: false,
    });

    if (response.isError) {
      this.productsMeta.setLoadedErrorMeta(response.error || 'Failed to load products');
      return;
    }

    if (!response.data) {
      runInAction(() => {
        this.products = [];
        this.total = 0;
        this.pageCount = 1;
        this.productsMeta.setLoadedSuccessMeta();
      });
      return;
    }

    const products = response.data.data;
    const total = response.data.meta.pagination.total;
    const pageCount = response.data.meta.pagination.pageCount;

    runInAction(() => {
      this.products = products;
      this.total = total;
      this.pageCount = pageCount;
      this.productsMeta.setLoadedSuccessMeta();
    });
  }

  private _updateUrl() {
    this._queryParamsStore.setParams({
      page: this.page,
      ...(this.searchQuery ? { search: this.searchQuery } : {}),
      ...(this.selectedCategories.length > 0
        ? { categories: this.selectedCategories.map((c) => c.key).join(',') }
        : {}),
    });
  }
  setPage(page: number) {
    this.page = page;
    this._updateUrl();
    this._loadProducts();
  }
  applyFilter(categories: Option[]) {
    this.selectedCategories = categories;
    this.page = 1;
    this._updateUrl();
    this._loadProducts();
  }

  applySearch(query: string) {
    this.searchQuery = query;
    this.page = 1;
    this._updateUrl();
    this._loadProducts();
  }

  destroy() {
    this.productsMeta.resetMeta();
    if (this._reactionDisposer) {
      this._reactionDisposer();
    }
    this.products = [];
    this.categories = [];
    this.selectedCategories = [];
    this.searchQuery = '';
    this.page = 1;
  }
}
