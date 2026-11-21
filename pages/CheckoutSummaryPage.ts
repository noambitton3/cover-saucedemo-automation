import { Page, Locator } from '@playwright/test';

/** Checkout step 2: order summary, prices and totals. */
export class CheckoutSummaryPage {
  readonly page: Page;
  readonly summaryItems: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly finishButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.summaryItems = page.getByTestId('inventory-item');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.itemPrices = page.getByTestId('inventory-item-price');
    this.subtotalLabel = page.getByTestId('subtotal-label');
    this.taxLabel = page.getByTestId('tax-label');
    this.totalLabel = page.getByTestId('total-label');
    this.finishButton = page.getByTestId('finish');
    this.cancelButton = page.getByTestId('cancel');
  }

  /** Returns the prices as numbers, without the "$" sign. */
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

  /** Reads the number after the "$" in a label such as "Tax: $2.40". */
  private async getAmount(label: Locator): Promise<number> {
    const text = await label.textContent();
    return parseFloat(text?.split('$')[1] ?? '0');
  }
}