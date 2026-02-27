import { getCategories } from 'api/categories';
import type { Option } from 'components/MultiDropdown';
import { makeAutoObservable, runInAction } from 'mobx';

import { getProducts } from '../api/products';
import type { Product } from '../types/Product';

export class ProductStore {
  products: Product[] = [];
  loading = false;
  error: string | null = null;
  page = 1;
  pageSize = 9;
  total: number = 0;
  pageCount = 1;
  searchQuery = '';

  categories: Option[] = [];
  selectedCategories: Option[] = [];

  constructor() {
    makeAutoObservable(this);
    this.loadCategories();
    this.initFromUrl();
    this.loadProducts();
  }

  private applyFilterFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const categoriesParam = params.get('categories');
    if (categoriesParam && this.categories.length > 0) {
      const categoryKeys = categoriesParam.split(',');
      this.selectedCategories = this.categories.filter((cat) => categoryKeys.includes(cat.key));
    }
  }

  async loadCategories() {
    try {
      const cats = await getCategories();
      runInAction(() => {
        this.categories = cats;
        this.applyFilterFromUrl();
      });
    } catch (error) {
      console.error('Failed to load categories,', error);
    }
  }

  async loadProducts() {
    this.loading = true;
    this.error = null;
    try {
      const response = await getProducts(
        this.page,
        this.pageSize,
        this.searchQuery,
        this.selectedCategories
      );
      runInAction(() => {
        this.products = response.data;
        this.total = response.meta.pagination.total;
        this.pageCount = response.meta.pagination.pageCount;
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
        this.error = error instanceof Error ? error.message : `Error: ${error}`; //поправлю
      });
      console.error('Failed to load products', error);
    }
  }

  initFromUrl() {
    const params = new URLSearchParams(window.location.search);

    this.page = Number(params.get('page')) || 1;
    this.searchQuery = params.get('search') || '';

    const categoriesParam = params.get('categories');
    if (categoriesParam) {
      const categoryKeys = categoriesParam.split(',');
      this.selectedCategories = this.categories.filter((cat) => categoryKeys.includes(cat.key));
    }
  }

  applyFilter(categiories: Option[]) {
    this.selectedCategories = categiories;
    this.page = 1;
    this.updateUrl();
    this.loadProducts();
  }

  applySearch(query: string) {
    this.searchQuery = query;
    this.page = 1;
    this.updateUrl();
    this.loadProducts();
  }

  setPage(page: number) {
    this.page = page;
    this.updateUrl();
    this.loadProducts();
  }

  private updateUrl() {
    const url = new URL(window.location.href);

    url.searchParams.set('page', String(this.page));

    if (this.searchQuery) {
      url.searchParams.set('search', this.searchQuery);
    } else {
      url.searchParams.delete('search');
    }

    if (this.selectedCategories.length > 0) {
      url.searchParams.set('categories', this.selectedCategories.map((c) => c.key).join(','));
    } else {
      url.searchParams.delete('categories');
    }

    window.history.pushState({}, '', url.toString());
  }
}
