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

   test('adding several products updates badge and shows all of them in cart', { tag: '@regression' }, async ({ inventoryPage, cartPage }) => {
    const selected = [products.backpack, products.bikeLight, products.boltTShirt];

    for (const product of selected) {
      await inventoryPage.addToCart(product);
    }

    await expect.soft(inventoryPage.header.cartBadge).toHaveText(String(selected.length));

    await inventoryPage.header.goToCart();
    await expect(cartPage.pageTitle).toHaveText('Your Cart');
    await expect.soft(cartPage.cartItemNames).toHaveText(selected);
  });

  test('removing the product from cart page leaves the cart empty', { tag: '@regression' }, async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.header.goToCart();
    await expect(cartPage.pageTitle).toHaveText('Your Cart');

    await cartPage.removeItem(products.backpack);

    await expect.soft(cartPage.cartItems).toHaveCount(0);
    await expect.soft(cartPage.header.cartBadge).toBeHidden();
  });

  test('cart content is kept after page reload', { tag: '@regression' }, async ({ page, inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.header.goToCart();
    await expect(cartPage.pageTitle).toHaveText('Your Cart');

    await page.reload();

    await expect.soft(cartPage.cartItemNames).toHaveText([products.backpack]);
    await expect.soft(cartPage.header.cartBadge).toHaveText('1');
  });
    
  test('cart navigation: continue shopping and checkout', { tag: '@regression' }, async ({ inventoryPage, cartPage, checkoutInfoPage }) => {
    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.header.goToCart();
    await expect(cartPage.pageTitle).toHaveText('Your Cart');

    await test.step('continue shopping returns to products page and keeps the cart', async () => {
      await cartPage.continueShopping();

      await expect.soft(inventoryPage.title).toHaveText('Products');
      await expect.soft(inventoryPage.header.cartBadge).toHaveText('1');
    });

    await test.step('checkout opens the checkout information form', async () => {
      await inventoryPage.header.goToCart();
      await cartPage.goToCheckout();

      await expect(checkoutInfoPage.firstNameInput).toBeVisible();
    });
  });
});