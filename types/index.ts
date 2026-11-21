import type { Locator } from '@playwright/test';

/** Login credentials of a SauceDemo user. */
export interface User {
  username: string;
  password: string;
}

/** Customer details for the checkout information form. */
export interface CheckoutInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

/** Options of the products sort dropdown. Each value is the option's value on the site. */
export enum SortOption {
  NameAtoZ = 'az',
  NameZtoA = 'za',
  PriceLowToHigh = 'lohi',
  PriceHighToLow = 'hilo',
}

/** Locators of a single product card on the products page. */
export interface ProductCard {
  name: Locator;
  description: Locator;
  price: Locator;
  image: Locator;
  addToCartButton: Locator;
  removeButton: Locator;
}

/** Locators of a single product row in the cart. */
export interface CartItem {
  name: Locator;
  description: Locator;
  price: Locator;
  removeButton: Locator;
}