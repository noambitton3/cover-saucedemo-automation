import { Page, Locator } from '@playwright/test';

export class CheckoutSummaryPage {
  readonly page: Page;
  readonly summaryItems: Locator;
  readonly itemPrices: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly finishButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.summaryItems = page.getByTestId('inventory-item');
    this.itemPrices = page.getByTestId('inventory-item-price');
    this.subtotalLabel = page.getByTestId('subtotal-label');
    this.taxLabel = page.getByTestId('tax-label');
    this.totalLabel = page.getByTestId('total-label');
    this.finishButton = page.getByTestId('finish');
    this.cancelButton = page.getByTestId('cancel');
  }

  async getItemPrices(): Promise<number[]> {
    const texts = await this.itemPrices.allTextContents();
    return texts.map((text) => parseFloat(text.replace('$', '')));
  }

  async getSubtotal(): Promise<number> {
    return this.getAmount(this.subtotalLabel);
  }

  async getTax(): Promise<number> {
    return this.getAmount(this.taxLabel);
  }

  async getTotal(): Promise<number> {
    return this.getAmount(this.totalLabel);
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }

    async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  private async getAmount(label: Locator): Promise<number> {
    const text = await label.textContent();
    return parseFloat(text?.split('$')[1] ?? '0');
  }
}