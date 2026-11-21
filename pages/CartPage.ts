import { Page, Locator } from '@playwright/test';
import { HeaderComponent } from '../components/HeaderComponent';
import { CartItem } from '../types';

/** Cart page: the products in the cart, remove, continue shopping and checkout. */
export class CartPage {
  readonly page: Page;
  readonly header: HeaderComponent;
  readonly pageTitle: Locator;
  readonly cartItems: Locator;
  readonly cartItemNames: Locator;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = new HeaderComponent(page);
    this.pageTitle = page.getByTestId('title');
    this.cartItems = page.getByTestId('inventory-item');
    this.cartItemNames = page.getByTestId('inventory-item-name');
    this.continueShoppingButton = page.getByTestId('continue-shopping');
    this.checkoutButton = page.getByTestId('checkout');
  }

  /** Returns the locators inside the cart row of the product with the given name. */
  getItemByName(name: string): CartItem {
    const item = this.cartItems.filter({ hasText: name });
    return {
      name: item.getByTestId('inventory-item-name'),
      description: item.getByTestId('inventory-item-desc'),
      price: item.getByTestId('inventory-item-price'),
      removeButton: item.getByRole('button', { name: 'Remove' }),
    };
  }

  async removeItem(name: string): Promise<void> {
    await this.getItemByName(name).removeButton.click();
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  async goToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
}