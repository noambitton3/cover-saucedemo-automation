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
  NameAtoZ = 'az',
  NameZtoA = 'za',
  PriceLowToHigh = 'lohi',
  PriceHighToLow = 'hilo',
}