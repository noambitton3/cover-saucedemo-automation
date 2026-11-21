import { test, expect } from '../fixtures/fixtures';
import { users, products, checkoutInfo, ErrorMessages } from '../data/testData';

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

  test('missing required fields show the matching error', { tag: '@regression' }, async ({ inventoryPage, cartPage, checkoutInfoPage }) => {
    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.header.goToCart();
    await expect(cartPage.pageTitle).toHaveText('Your Cart');
    await cartPage.goToCheckout();
    await expect(checkoutInfoPage.firstNameInput).toBeVisible();

    const missingFieldCases = [
      { field: 'first name', info: { ...checkoutInfo, firstName: '' }, error: ErrorMessages.firstNameRequired },
      { field: 'last name', info: { ...checkoutInfo, lastName: '' }, error: ErrorMessages.lastNameRequired },
      { field: 'postal code', info: { ...checkoutInfo, postalCode: '' }, error: ErrorMessages.postalCodeRequired },
    ];

    for (const { field, info, error } of missingFieldCases) {
      await test.step(`missing ${field} shows its error`, async () => {
        await checkoutInfoPage.fillForm(info);
        await checkoutInfoPage.clickContinue();
        await expect.soft(checkoutInfoPage.errorMessage).toHaveText(error);
      });
    }
  });

  test('summary calculates totals correctly', { tag: '@regression' }, async ({ inventoryPage, cartPage, checkoutInfoPage, checkoutSummaryPage }) => {
    await inventoryPage.addToCart(products.backpack);
    await inventoryPage.addToCart(products.bikeLight);
    await inventoryPage.header.goToCart();
    await expect(cartPage.pageTitle).toHaveText('Your Cart');
    await cartPage.goToCheckout();
    await checkoutInfoPage.fillForm(checkoutInfo);
    await checkoutInfoPage.clickContinue();
    await expect(checkoutSummaryPage.summaryItems).toHaveCount(2);

    const prices = await checkoutSummaryPage.getItemPrices();
    const subtotal = await checkoutSummaryPage.getSubtotal();
    const tax = await checkoutSummaryPage.getTax();
    const total = await checkoutSummaryPage.getTotal();
    const pricesSum = prices.reduce((sum, price) => sum + price, 0);

    expect.soft(subtotal).toBeCloseTo(pricesSum, 2);
    expect.soft(total).toBeCloseTo(subtotal + tax, 2);
  });
});