import { makeAutoObservable } from 'mobx';

export class QueryParamsStore {
  private params: URLSearchParams;

  constructor() {
    this.params = new URLSearchParams(window.location.search);
    makeAutoObservable(this);
  }

  getParam(key: string): string {
    return this.params.get(key) || '';
  }

  getNumberParam(key: string, defaultValue: number): number {
    const value = this.params.get(key);
    return value ? Number(value) : defaultValue;
  }

  getArrayParam(key: string): string[] {
    const value = this.params.get(key);
    return value ? value.split(',') : [];
  }

  setParam(key: string, value: string | number | string[]) {
    if (Array.isArray(value)) {
      if (value.length > 0) {
        this.params.set(key, value.join(','));
      } else {
        this.params.delete(key);
      }
    } else if (value) {
      this.params.set(key, String(value));
    } else {
      this.params.delete(key);
    }

    this.updateUrl();
  }

  setParams(updates: Record<string, string | number | string[]>) {
    const keysToKeep = new Set(Object.keys(updates));

    for (const key of Array.from(this.params.keys())) {
      if (!keysToKeep.has(key)) {
        this.params.delete(key);
      }
    }

    Object.entries(updates).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          this.params.set(key, value.join(','));
        } else {
          this.params.delete(key);
        }
      } else if (value) {
        this.params.set(key, String(value));
      } else {
        this.params.delete(key);
      }
    });

    this.updateUrl();
  }

  private updateUrl() {
    const url = new URL(window.location.href);
    url.search = this.params.toString();
    window.history.pushState({}, '', url.toString());
  }

  syncWithRouter(search: string) {
    this.params = new URLSearchParams(search);
  }
}
