import { test, expect } from '../fixtures/fixtures';
import { users, products, checkoutInfo } from '../data/testData';

test.describe('Checkout', () => {
  test.beforeEach(async ({ loginPage, inventoryPage }) => {
    await loginPage.goto();
    await loginPage.login(users.standard);
    await expect(inventoryPage.items.first()).toBeVisible();
  });

  test('happy path: complete purchase from cart to order confirmation', { tag: ['@smoke', '@regression'] }, async ({ inventoryPage, cartPage, checkoutInfoPage, checkoutSummaryPage, checkoutCompletePage }) => {
    const price = (await inventoryPage.getItemByName(products.backpack).price.textContent()) ?? '';

    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.header.goToCart();
    await expect(cartPage.pageTitle).toHaveText('Your Cart');
    await cartPage.goToCheckout();

    await test.step('fill information and continue to summary', async () => {
      await checkoutInfoPage.fillForm(checkoutInfo);
      await checkoutInfoPage.clickContinue();
      await expect(checkoutSummaryPage.finishButton).toBeVisible();
    });

    await test.step('summary shows the selected product name and price', async () => {
      await expect.soft(checkoutSummaryPage.itemNames).toHaveText([products.backpack]);
      await expect.soft(checkoutSummaryPage.itemPrices).toHaveText([price]);
    });

    await test.step('finish shows confirmation and empties the cart', async () => {
      await checkoutSummaryPage.finish();
      await expect(checkoutCompletePage.completeMessage).toHaveText('Thank you for your order!');
      await expect.soft(checkoutCompletePage.header.cartBadge).toBeHidden();
    });

    await test.step('back home returns to products page', async () => {
      await checkoutCompletePage.backHome();
      await expect(inventoryPage.title).toHaveText('Products');
    });
  });
});