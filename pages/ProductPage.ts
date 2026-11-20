import { Page, Locator } from '@playwright/test';
import { HeaderComponent } from '../components/HeaderComponent';

export class ProductPage {
  readonly page: Page;
  readonly header: HeaderComponent;
  readonly productName: Locator;
  readonly productDescription: Locator;
  readonly productPrice: Locator;
  readonly addToCartButton: Locator;
  readonly removeButton: Locator;
  readonly backToProductsButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = new HeaderComponent(page);
    this.productName = page.getByTestId('inventory-item-name');
    this.productDescription = page.getByTestId('inventory-item-desc');
    this.productPrice = page.getByTestId('inventory-item-price');
    this.addToCartButton = page.getByTestId('add-to-cart');
    this.removeButton = page.getByTestId('remove');
    this.backToProductsButton = page.getByTestId('back-to-products');
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }

  async backToProducts(): Promise<void> {
    await this.backToProductsButton.click();
  }
}