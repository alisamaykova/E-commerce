import { makeAutoObservable } from 'mobx';

export class MetaStore {
  isLoading = false;
  isLoaded = false;
  isError = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setLoadedStartMeta() {
    this.isLoading = true;
    this.isLoaded = false;
    this.isError = false;
    this.error = null;
  }

  setLoadedSuccessMeta() {
    this.isLoading = false;
    this.isLoaded = true;
    this.isError = false;
    this.error = null;
  }

  setLoadedErrorMeta(error: string) {
    this.isLoading = false;
    this.isLoaded = false;
    this.isError = true;
    this.error = error;
  }

  resetMeta() {
    this.isLoading = false;
    this.isLoaded = false;
    this.isError = false;
    this.error = null;
  }
}
