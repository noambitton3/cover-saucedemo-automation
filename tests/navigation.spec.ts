import { test, expect } from '../fixtures/fixtures';
import { users, ErrorMessages } from '../data/testData';

test.describe('Navigation', () => {
  test.beforeEach(async ({ loginPage, inventoryPage }) => {
    await loginPage.goto();
    await loginPage.login(users.standard);
    await expect(inventoryPage.items.first()).toBeVisible();
  });

  test('logout returns to login page and blocks access to products page', { tag: ['@smoke', '@regression'] }, async ({ inventoryPage, loginPage }) => {
    await test.step('logout from menu returns to an empty login form', async () => {
      await inventoryPage.header.logout();

      await expect(loginPage.loginButton).toBeVisible();
      await expect.soft(loginPage.usernameInput).toHaveValue('');
      await expect.soft(loginPage.passwordInput).toHaveValue('');
    });

    await test.step('products page is blocked after logout', async () => {
      await inventoryPage.goto();
      await expect(loginPage.errorMessage).toHaveText(ErrorMessages.protectedPage('/inventory.html'));
    });
  });
});

test.describe('Navigation - not logged in', () => {
  test('protected pages redirect to login with an error', { tag: '@regression' }, async ({ page, loginPage }) => {
    const protectedPaths = [
      '/inventory.html',
      '/inventory-item.html',
      '/cart.html',
      '/checkout-step-one.html',
      '/checkout-step-two.html',
      '/checkout-complete.html',
    ];

    for (const path of protectedPaths) {
      await test.step(`${path} is blocked without login`, async () => {
        await page.goto(path);
        await expect.soft(loginPage.errorMessage).toHaveText(ErrorMessages.protectedPage(path));
      });
    }
  });
});