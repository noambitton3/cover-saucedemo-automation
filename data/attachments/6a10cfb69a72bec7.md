# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: checkout.spec.ts >> Checkout - problem user >> last name field does not keep the typed value (known bug)
- Location: tests/checkout.spec.ts:120:3

# Error details

```
Error: expect(locator).toHaveValue(expected) failed

Locator:  getByTestId('lastName')
Expected: "Bitton"
Received: ""
Timeout:  5000ms

Call log:
  - Expect "toHaveValue" getByTestId('lastName') with timeout 5000ms
  - waiting for getByTestId('lastName')
    14 × locator resolved to <input value="" type="text" id="last-name" name="lastName" autocorrect="off" data-test="lastName" autocapitalize="none" aria-label="Last Name" placeholder="Last Name" class="input_error form_input"/>
       - unexpected value ""

```

```yaml
- textbox "Last Name"
```

# Test source

```ts
  31  |       await checkoutSummaryPage.finish();
  32  |       await expect(checkoutCompletePage.completeMessage).toHaveText('Thank you for your order!');
  33  |       await expect.soft(checkoutCompletePage.header.cartBadge).toBeHidden();
  34  |     });
  35  | 
  36  |     await test.step('back home returns to products page', async () => {
  37  |       await checkoutCompletePage.backHome();
  38  |       await expect(inventoryPage.title).toHaveText('Products');
  39  |     });
  40  |   });
  41  | 
  42  |   test('missing required fields show the matching error', { tag: '@regression' }, async ({ inventoryPage, cartPage, checkoutInfoPage }) => {
  43  |     await inventoryPage.addToCart(products.backpack);
  44  |     await inventoryPage.header.goToCart();
  45  |     await expect(cartPage.pageTitle).toHaveText('Your Cart');
  46  |     await cartPage.goToCheckout();
  47  |     await expect(checkoutInfoPage.firstNameInput).toBeVisible();
  48  | 
  49  |     const missingFieldCases = [
  50  |       { field: 'first name', info: { ...checkoutInfo, firstName: '' }, error: ErrorMessages.firstNameRequired },
  51  |       { field: 'last name', info: { ...checkoutInfo, lastName: '' }, error: ErrorMessages.lastNameRequired },
  52  |       { field: 'postal code', info: { ...checkoutInfo, postalCode: '' }, error: ErrorMessages.postalCodeRequired },
  53  |     ];
  54  | 
  55  |     for (const { field, info, error } of missingFieldCases) {
  56  |       await test.step(`missing ${field} shows its error`, async () => {
  57  |         await checkoutInfoPage.fillForm(info);
  58  |         await checkoutInfoPage.clickContinue();
  59  |         await expect.soft(checkoutInfoPage.errorMessage).toHaveText(error);
  60  |       });
  61  |     }
  62  |   });
  63  | 
  64  |   test('cancel on information form returns to cart and keeps the product', { tag: '@regression' }, async ({ inventoryPage, cartPage, checkoutInfoPage }) => {
  65  |     await inventoryPage.addToCart(products.backpack);
  66  |     await inventoryPage.header.goToCart();
  67  |     await expect(cartPage.pageTitle).toHaveText('Your Cart');
  68  |     await cartPage.goToCheckout();
  69  |     await expect(checkoutInfoPage.firstNameInput).toBeVisible();
  70  | 
  71  |     await checkoutInfoPage.cancel();
  72  | 
  73  |     await expect(cartPage.pageTitle).toHaveText('Your Cart');
  74  |     await expect(cartPage.cartItemNames).toHaveText([products.backpack]);
  75  |   });
  76  | 
  77  |   test('summary calculates totals correctly', { tag: '@regression' }, async ({ inventoryPage, cartPage, checkoutInfoPage, checkoutSummaryPage }) => {
  78  |     await inventoryPage.addToCart(products.backpack);
  79  |     await inventoryPage.addToCart(products.bikeLight);
  80  |     await inventoryPage.header.goToCart();
  81  |     await expect(cartPage.pageTitle).toHaveText('Your Cart');
  82  |     await cartPage.goToCheckout();
  83  |     await checkoutInfoPage.fillForm(checkoutInfo);
  84  |     await checkoutInfoPage.clickContinue();
  85  |     await expect(checkoutSummaryPage.summaryItems).toHaveCount(2);
  86  | 
  87  |     const prices = await checkoutSummaryPage.getItemPrices();
  88  |     const subtotal = await checkoutSummaryPage.getSubtotal();
  89  |     const tax = await checkoutSummaryPage.getTax();
  90  |     const total = await checkoutSummaryPage.getTotal();
  91  |     const pricesSum = prices.reduce((sum, price) => sum + price, 0);
  92  | 
  93  |     expect.soft(subtotal).toBeCloseTo(pricesSum, 2);
  94  |     expect.soft(total).toBeCloseTo(subtotal + tax, 2);
  95  |   });
  96  | 
  97  |   test('cancel on summary returns to products page and keeps the cart', { tag: '@regression' }, async ({ inventoryPage, cartPage, checkoutInfoPage, checkoutSummaryPage }) => {
  98  |     await inventoryPage.addToCart(products.backpack);
  99  |     await inventoryPage.header.goToCart();
  100 |     await expect(cartPage.pageTitle).toHaveText('Your Cart');
  101 |     await cartPage.goToCheckout();
  102 |     await checkoutInfoPage.fillForm(checkoutInfo);
  103 |     await checkoutInfoPage.clickContinue();
  104 |     await expect(checkoutSummaryPage.finishButton).toBeVisible();
  105 | 
  106 |     await checkoutSummaryPage.cancel();
  107 | 
  108 |     await expect(inventoryPage.title).toHaveText('Products');
  109 |     await expect(inventoryPage.header.cartBadge).toHaveText('1');
  110 |   });
  111 | });
  112 | 
  113 | test.describe('Checkout - problem user', () => {
  114 |   test.beforeEach(async ({ loginPage, inventoryPage }) => {
  115 |     await loginPage.goto();
  116 |     await loginPage.login(users.problem);
  117 |     await expect(inventoryPage.items.first()).toBeVisible();
  118 |   });
  119 | 
  120 |   test('last name field does not keep the typed value (known bug)', { tag: '@regression' }, async ({ inventoryPage, cartPage, checkoutInfoPage }) => {
  121 |     test.fail(true, 'Known bug: last name input does not keep its value for problem_user');
  122 | 
  123 |     await inventoryPage.addToCart(products.backpack);
  124 |     await inventoryPage.header.goToCart();
  125 |     await expect(cartPage.pageTitle).toHaveText('Your Cart');
  126 |     await cartPage.goToCheckout();
  127 |     await expect(checkoutInfoPage.firstNameInput).toBeVisible();
  128 | 
  129 |     await checkoutInfoPage.fillForm(checkoutInfo);
  130 | 
> 131 |     await expect(checkoutInfoPage.lastNameInput).toHaveValue(checkoutInfo.lastName);
      |                                                  ^ Error: expect(locator).toHaveValue(expected) failed
  132 |   });
  133 | });
```