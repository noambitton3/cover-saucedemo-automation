import { test, expect } from '../fixtures/fixtures';
import { users } from '../data/testData';
import { SortOption } from '../types';

test.describe('Products', () => {
  test.describe('standard user', () => {
    test.beforeEach(async ({ loginPage, inventoryPage }) => {
      await loginPage.goto();
      await loginPage.login(users.standard);
      await expect(inventoryPage.items.first()).toBeVisible();
    });

    test('happy path: browse products, open details and return to list', { tag: ['@smoke', '@regression'] }, async ({ page, inventoryPage, productPage }) => {
      const namesBefore = await inventoryPage.getItemNames();

      await test.step('every product shows name, price, image and add to cart button', async () => {
        const count = await inventoryPage.items.count();
        for (let i = 0; i < count; i++) {
          const product = inventoryPage.getItemByIndex(i);
          await expect.soft(product.name).not.toBeEmpty();
          await expect.soft(product.price).toHaveText(/^\$\d+\.\d{2}$/);
          await expect.soft(product.image).toBeVisible();
          await expect.soft(product.addToCartButton).toBeVisible();
          await expect.soft(product.addToCartButton).toBeEnabled();
        }
      });

      await test.step('product page shows the same details as the list', async () => {
        const firstProduct = inventoryPage.getItemByIndex(0);
        const name = (await firstProduct.name.textContent()) ?? '';
        const description = (await firstProduct.description.textContent()) ?? '';
        const price = (await firstProduct.price.textContent()) ?? '';

        await firstProduct.name.click();

        await expect.soft(productPage.productName).toHaveText(name);
        await expect.soft(productPage.productDescription).toHaveText(description);
        await expect.soft(productPage.productPrice).toHaveText(price);
      });

      await test.step('back to products returns to the list in the same order', async () => {
        await productPage.backToProducts();

        await expect(page).toHaveURL(/inventory\.html/);
        expect(await inventoryPage.getItemNames()).toEqual(namesBefore);
      });
    });

    const sortCases = [
      { option: SortOption.NameAtoZ, by: 'name', order: 'ascending' },
      { option: SortOption.NameZtoA, by: 'name', order: 'descending' },
      { option: SortOption.PriceLowToHigh, by: 'price', order: 'ascending' },
      { option: SortOption.PriceHighToLow, by: 'price', order: 'descending' },
    ] as const;

    for (const { option, by, order } of sortCases) {
      test(`sort by ${by} ${order}`, { tag: '@regression' }, async ({ inventoryPage }) => {
        await inventoryPage.sortBy(option);

        if (by === 'name') {
          const names = await inventoryPage.getItemNames();
          const expected = [...names].sort((a, b) => a.localeCompare(b));
          if (order === 'descending') expected.reverse();
          expect(names).toEqual(expected);
        } else {
          const prices = await inventoryPage.getItemPrices();
          const expected = [...prices].sort((a, b) => a - b);
          if (order === 'descending') expected.reverse();
          expect(prices).toEqual(expected);
        }
      });
    }
  });

  test.describe('problem user', () => {
    test.beforeEach(async ({ loginPage, inventoryPage }) => {
      await loginPage.goto();
      await loginPage.login(users.problem);
      await expect(inventoryPage.items.first()).toBeVisible();
    });

    test('sorting by name Z to A does not work (known bug)', { tag: '@regression' }, async ({ inventoryPage }) => {
      test.fail(true, 'Known bug: sorting has no effect for problem_user');

      await inventoryPage.sortBy(SortOption.NameZtoA);

      const names = await inventoryPage.getItemNames();
      const expected = [...names].sort((a, b) => b.localeCompare(a));
      expect(names).toEqual(expected);
    });
  });
});