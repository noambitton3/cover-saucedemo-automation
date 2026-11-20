import { Page, Locator } from '@playwright/test';
import { HeaderComponent } from '../components/HeaderComponent';

export class CartPage {
  readonly page: Page;
  readonly header: HeaderComponent;
  readonly pageTitle: Locator;
  readonly cartItems: Locator;
  readonly cartItemNames: Locator;
  readonly cartItemPrices: Locator;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = new HeaderComponent(page);
    this.pageTitle = page.getByTestId('title');
    this.cartItems = page.getByTestId('inventory-item');
    this.cartItemNames = page.getByTestId('inventory-item-name');
    this.cartItemPrices = page.getByTestId('inventory-item-price');
    this.continueShoppingButton = page.getByTestId('continue-shopping');
    this.checkoutButton = page.getByTestId('checkout');
  }

  async goto(): Promise<void> {
    await this.page.goto('/cart.html');
  }

  async getItemNames(): Promise<string[]> {
    return this.cartItemNames.allTextContents();
  }

  async removeItem(name: string): Promise<void> {
    await this.cartItems.filter({ hasText: name }).getByRole('button', { name: 'Remove' }).click();
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  async goToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
}