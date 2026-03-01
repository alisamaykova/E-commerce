import { makeAutoObservable, runInAction } from 'mobx';

import { getCategories } from '../../../api/categories';
import { getProducts } from '../../../api/products';
import type { Option } from '../../../components/MultiDropdown/MultiDropdown';
import type { Product } from '../../../types/Product';
import { MetaStore } from '../../shared/MetaStore';

export class ProductListPageStore {
  queryParamsStore: any;

  products: Product[] = [];
  productsMeta = new MetaStore();

  page = 1;
  pageSize = 9;
  total = 0;
  pageCount = 1;
  searchQuery = '';

  categories: Option[] = [];
  selectedCategories: Option[] = [];

  constructor(queryParamsStore: any) {
    this.queryParamsStore = queryParamsStore;
    makeAutoObservable(this);
    this.loadCategories();
    this.initFromUrl();
    this.loadProducts();
  }

  private initFromUrl() {
    this.page = this.queryParamsStore.getNumberParam('page', 1);
    this.searchQuery = this.queryParamsStore.getParam('search');
  }
  private updateUrl() {
    this.queryParamsStore.setParams({
      page: this.page,
      ...(this.searchQuery ? { search: this.searchQuery } : {}),
      ...(this.selectedCategories.length > 0
        ? { categories: this.selectedCategories.map((c) => c.key).join(',') }
        : {}),
    });
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

  private applyFilterFromUrl() {
    const categoryKeys = this.queryParamsStore.getArrayParam('categories');
    if (categoryKeys.length > 0 && this.categories.length > 0) {
      this.selectedCategories = this.categories.filter((cat) => categoryKeys.includes(cat.key));
      this.loadProducts();
    }
  }

  async loadProducts() {
    this.productsMeta.setLoadedStartMeta();

    const response = await getProducts(
      this.page,
      this.pageSize,
      this.searchQuery,
      this.selectedCategories
    );

    if (response.isError) {
      this.productsMeta.setLoadedErrorMeta(response.error || 'Failed to load products');
      return;
    }

    runInAction(() => {
      this.products = response.data?.data || [];
      this.total = response.data?.meta.pagination.total || 0;
      this.pageCount = response.data?.meta.pagination.pageCount || 1;
      this.productsMeta.setLoadedSuccessMeta();
    });
  }

  applyFilter(categories: Option[]) {
    console.log('applyFilter called with:', categories);
    this.selectedCategories = categories;
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

  destroy() {
    this.productsMeta.resetMeta();
    this.products = [];
    this.categories = [];
    this.selectedCategories = [];
    this.searchQuery = '';
    this.page = 1;
    this.total = 0;
    this.pageCount = 1;
  }
}
