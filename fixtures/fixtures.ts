import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutInfoPage } from '../pages/CheckoutInfoPage';
import { CheckoutSummaryPage } from '../pages/CheckoutSummaryPage';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';

type Pages = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  productPage: ProductPage;
  cartPage: CartPage;
  checkoutInfoPage: CheckoutInfoPage;
  checkoutSummaryPage: CheckoutSummaryPage;
  checkoutCompletePage: CheckoutCompletePage;
};

export const test = base.extend<Pages>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutInfoPage: async ({ page }, use) => {
    await use(new CheckoutInfoPage(page));
  },
  checkoutSummaryPage: async ({ page }, use) => {
    await use(new CheckoutSummaryPage(page));
  },
  checkoutCompletePage: async ({ page }, use) => {
    await use(new CheckoutCompletePage(page));
  },
});

export { expect };