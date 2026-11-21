import { Page, Locator, expect } from '@playwright/test';

/** Header shown on every page after login: cart icon and side menu. */
export class HeaderComponent {
  readonly page: Page;
  readonly cartIcon: Locator;
  readonly cartBadge: Locator;
  readonly menuButton: Locator;
  readonly closeMenuButton: Locator;
  readonly allItemsLink: Locator;
  readonly aboutLink: Locator;
  readonly logoutLink: Locator;
  readonly resetAppStateLink: Locator;
  readonly menuLinks: Locator[];

  constructor(page: Page) {
    this.page = page;
    this.cartIcon = page.getByTestId('shopping-cart-link');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.menuButton = page.getByRole('button', { name: 'Open Menu' });
    this.closeMenuButton = page.getByRole('button', { name: 'Close Menu' });
    this.allItemsLink = page.getByTestId('inventory-sidebar-link');
    this.aboutLink = page.getByTestId('about-sidebar-link');
    this.logoutLink = page.getByTestId('logout-sidebar-link');
    this.resetAppStateLink = page.getByTestId('reset-sidebar-link');
    this.menuLinks = [this.allItemsLink, this.aboutLink, this.logoutLink, this.resetAppStateLink];
  }

  async goToCart(): Promise<void> {
    await this.cartIcon.click();
  }

  /**
   * Opens the side menu and makes sure all its links are visible.
   * Retries with toPass, because on some browsers the menu does not always
   * respond to the first click and can close by itself right after opening.
   */
  async openMenu(): Promise<void> {
    await expect(async () => {
      if (!(await this.allItemsLink.isVisible())) {
        await this.menuButton.click({ timeout: 2_000 });
      }
      for (const link of this.menuLinks) {
        await expect(link).toBeVisible({ timeout: 2_000 });
      }
    }).toPass();
  }

/** Closes the side menu with X and makes sure its links are no longer visible. Retries like openMenu. */
  async closeMenu(): Promise<void> {
    await expect(async () => {
      if (await this.allItemsLink.isVisible()) {
        await this.closeMenuButton.click({ timeout: 2_000 });
      }
      await expect(this.allItemsLink).toBeHidden({ timeout: 2_000 });
    }).toPass();
  }

  async goToAllItems(): Promise<void> {
    await this.clickMenuLink(this.allItemsLink);
  }

  async logout(): Promise<void> {
    await this.clickMenuLink(this.logoutLink);
  }

  async resetAppState(): Promise<void> {
    await this.clickMenuLink(this.resetAppStateLink);
  }

  /** Opens the menu and clicks a link in it. If the menu closed before the click, starts over. */
  private async clickMenuLink(link: Locator): Promise<void> {
    await expect(async () => {
      await this.openMenu();
      await link.click({ timeout: 2_000 });
    }).toPass();
  }
}