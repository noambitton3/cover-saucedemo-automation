export interface User {
  username: string;
  password: string;
}

export interface CheckoutInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export enum SortOption {
  NameAZ = 'az',
  NameZA = 'za',
  PriceLowHigh = 'lohi',
  PriceHighLow = 'hilo',
}