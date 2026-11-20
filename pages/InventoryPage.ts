import { Page, Locator } from '@playwright/test';
import { SortOption } from '../types';
import { HeaderComponent } from '../components/HeaderComponent';

export class InventoryPage {
  readonly page: Page;
  readonly header: HeaderComponent;
  readonly title: Locator;
  readonly items: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly itemImages: Locator;
  readonly sortDropdown: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = new HeaderComponent(page);
    this.title = page.getByTestId('title');
    this.items = page.getByTestId('inventory-item');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.itemPrices = page.getByTestId('inventory-item-price');
    this.itemImages = this.items.locator('img');
    this.sortDropdown = page.getByTestId('product-sort-container');
  }

  async goto(): Promise<void> {
    await this.page.goto('/inventory.html');
  }

  async sortBy(option: SortOption): Promise<void> {
    await this.sortDropdown.selectOption(option);
  }

  async getItemNames(): Promise<string[]> {
    return this.itemNames.allTextContents();
  }

  async getItemPrices(): Promise<number[]> {
    const texts = await this.itemPrices.allTextContents();
    return texts.map((text) => parseFloat(text.replace('$', '')));
  }

  getItem(name: string): Locator {
    return this.items.filter({ hasText: name });
  }

  async addToCart(name: string): Promise<void> {
    await this.getItem(name).getByRole('button', { name: 'Add to cart' }).click();
  }

  async removeFromCart(name: string): Promise<void> {
    await this.getItem(name).getByRole('button', { name: 'Remove' }).click();
  }

  async openProduct(name: string): Promise<void> {
    await this.itemNames.filter({ hasText: name }).click();
  }

  getItemByIndex(index: number) {
    return this.getItemDetails(this.items.nth(index));
  }

  getItemByName(name: string) {
    return this.getItemDetails(this.getItem(name));
  }

  getItemButton(name: string): Locator {
    return this.getItem(name).getByRole('button');
  }

  private getItemDetails(item: Locator) {
    return {
      name: item.getByTestId('inventory-item-name'),
      description: item.getByTestId('inventory-item-desc'),
      price: item.getByTestId('inventory-item-price'),
      image: item.locator('img'),
      addToCartButton: item.getByRole('button', { name: 'Add to cart' }),
    };
  }
}