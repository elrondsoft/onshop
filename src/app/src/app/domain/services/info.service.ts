import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class InfoService {
  private _appInfo: AppInfo;

  get appInfo(): AppInfo {
    return this._appInfo;
  }

  public setAppInfo(x: AppInfo) {
    if (x) {
      this._appInfo = x;
      localStorage.setItem(Constants.APP_INFO_KEY, JSON.stringify(this._appInfo));
    }
  }

  constructor() {
    const x = JSON.parse(localStorage.getItem(Constants.APP_INFO_KEY));
    this._appInfo = x ? x : new AppInfo();
  }
}

export class AppInfo {
  email: string;
  phone: string;
  address: string;
  promo1: string;
  promo2: string;
  deliveryFee: number;
  deliveryDuration: number;

  constructor(init?: Partial<AppInfo>) {
    Object.assign(this as any, init);
  }
}

const Constants = {
  APP_INFO_KEY: 'onshop-app-info',
};
