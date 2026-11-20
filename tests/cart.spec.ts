import { test, expect } from '../fixtures/fixtures';
import { users, products } from '../data/testData';

test.describe('Cart', () => {
  test.beforeEach(async ({ loginPage, inventoryPage }) => {
    await loginPage.goto();
    await loginPage.login(users.standard);
    await expect(inventoryPage.items.first()).toBeVisible();
  });

  test('add and remove from products page updates cart badge and button', { tag: ['@smoke', '@regression'] }, async ({ inventoryPage }) => {
    await test.step('add product: badge shows 1 and button changes to Remove', async () => {
      await inventoryPage.addToCart(products.backpack);

      await expect.soft(inventoryPage.header.cartBadge).toHaveText('1');
      await expect.soft(inventoryPage.getItemByName(products.backpack).removeButton).toBeVisible();
    });

    await test.step('remove product: badge disappears and button changes back', async () => {
      await inventoryPage.removeFromCart(products.backpack);

      await expect.soft(inventoryPage.header.cartBadge).toBeHidden();
      await expect.soft(inventoryPage.getItemByName(products.backpack).addToCartButton).toBeVisible();
    });
  });
});