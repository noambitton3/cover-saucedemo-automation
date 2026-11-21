import { test, expect } from '../fixtures/fixtures';
import { users, products, ErrorMessages } from '../data/testData';

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

  test('menu opens with all links and closes with X', { tag: '@regression' }, async ({ inventoryPage }) => {
    const header = inventoryPage.header;
    
    await test.step('menu opens and shows all links', async () => {
      await header.openMenu();

      for (const link of header.menuLinks) {
        await expect.soft(link).toBeVisible();
      }
    });

    await test.step('X closes the menu', async () => {
      await header.closeMenu();
      await expect(header.allItemsLink).toBeHidden();
    });
  });

  test('all items link returns to products page from cart', { tag: '@regression' }, async ({ inventoryPage, cartPage }) => {
    await inventoryPage.header.goToCart();
    await expect(cartPage.pageTitle).toHaveText('Your Cart');

    await cartPage.header.goToAllItems();

    await expect(inventoryPage.title).toHaveText('Products');
  });

  test('reset app state clears the cart badge', { tag: '@regression' }, async ({ inventoryPage }) => {
    await inventoryPage.addToCart(products.backpack);
    await expect(inventoryPage.header.cartBadge).toHaveText('1');

    await inventoryPage.header.resetAppState();
    await expect(inventoryPage.header.cartBadge).toBeHidden();
  });

  test('about link points to Sauce Labs website', { tag: '@regression' }, async ({ inventoryPage }) => {
    await inventoryPage.header.openMenu();
    await expect(inventoryPage.header.aboutLink).toHaveAttribute('href', 'https://saucelabs.com/');
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