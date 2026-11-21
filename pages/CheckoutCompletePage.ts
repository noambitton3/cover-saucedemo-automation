import { Page, Locator } from '@playwright/test';
import { HeaderComponent } from '../components/HeaderComponent';

/** Order confirmation page, shown after Finish. */
export class CheckoutCompletePage {
  readonly page: Page;
  readonly header: HeaderComponent;
  readonly completeMessage: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = new HeaderComponent(page);
    this.completeMessage = page.getByTestId('complete-header');
    this.backHomeButton = page.getByTestId('back-to-products');
  }

  async backHome(): Promise<void> {
    await this.backHomeButton.click();
  }
}