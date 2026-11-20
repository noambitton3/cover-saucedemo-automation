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

    test('cart shows the added product with the same details', { tag: '@regression' }, async ({ inventoryPage, cartPage }) => {
      const listed = inventoryPage.getItemByName(products.backpack);
      const name = (await listed.name.textContent()) ?? '';
      const description = (await listed.description.textContent()) ?? '';
      const price = (await listed.price.textContent()) ?? '';

      await inventoryPage.addToCart(products.backpack);
      await inventoryPage.header.goToCart();
      await expect(cartPage.pageTitle).toHaveText('Your Cart');

      const inCart = cartPage.getItemByName(products.backpack);
      await expect.soft(inCart.name).toHaveText(name);
      await expect.soft(inCart.description).toHaveText(description);
      await expect.soft(inCart.price).toHaveText(price);
      await expect.soft(inCart.removeButton).toBeVisible();
  });
});