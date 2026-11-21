import { Page, Locator } from '@playwright/test';
import { SortOption, ProductCard } from '../types';
import { HeaderComponent } from '../components/HeaderComponent';

/** Products list page (inventory): product cards, sorting and add/remove to cart. */
export class InventoryPage {
  readonly page: Page;
  readonly header: HeaderComponent;
  readonly title: Locator;
  readonly items: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly sortDropdown: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = new HeaderComponent(page);
    this.title = page.getByTestId('title');
    this.items = page.getByTestId('inventory-item');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.itemPrices = page.getByTestId('inventory-item-price');
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

  /** Returns the prices as numbers, without the "$" sign. */
  async getItemPrices(): Promise<number[]> {
    const texts = await this.itemPrices.allTextContents();
    return texts.map((text) => parseFloat(text.replace('$', '')));
  }

  async addToCart(name: string): Promise<void> {
    await this.getItemByName(name).addToCartButton.click();
  }

  async removeFromCart(name: string): Promise<void> {
    await this.getItemByName(name).removeButton.click();
  }

  /** Returns the locators of the product card at the given position (0 = first). */
  getItemByIndex(index: number): ProductCard {
    return this.getItemDetails(this.items.nth(index));
  }

  /** Returns the locators of the product card with the given name. */
  getItemByName(name: string): ProductCard {
    return this.getItemDetails(this.items.filter({ hasText: name }));
  }

  /** Builds the card locators inside a single product, so they don't match other products. */
  private getItemDetails(item: Locator): ProductCard {
    return {
      name: item.getByTestId('inventory-item-name'),
      description: item.getByTestId('inventory-item-desc'),
      price: item.getByTestId('inventory-item-price'),
      image: item.getByRole('img'),
      addToCartButton: item.getByRole('button', { name: 'Add to cart' }),
      removeButton: item.getByRole('button', { name: 'Remove' }),
    };
  }
}