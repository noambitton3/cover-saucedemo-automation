import { test, expect } from '../fixtures/fixtures';
import { users, ErrorMessages } from '../data/testData';

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('standard user logs in successfully', { tag: ['@smoke', '@regression'] }, async ({ page, loginPage, inventoryPage }) => {
    await loginPage.login(users.standard);

    await expect.soft(page).toHaveURL(/inventory\.html/);
    await expect.soft(inventoryPage.title).toHaveText('Products');
  });

  test('locked out user cannot log in', { tag: '@regression' }, async ({ page, loginPage }) => {
    await loginPage.login(users.lockedOut);

    await expect.soft(loginPage.errorMessage).toHaveText(ErrorMessages.lockedOut);
    await expect.soft(page).not.toHaveURL(/inventory\.html/);
  });

  test('invalid credentials show error', { tag: '@regression' }, async ({ loginPage }) => {
    await loginPage.login(users.invalid);

    await expect(loginPage.errorMessage).toHaveText(ErrorMessages.invalidCredentials);
  });

  test('empty username shows required error', { tag: '@regression' }, async ({ loginPage }) => {
    await loginPage.login({ ...users.standard, username: '' });

    await expect(loginPage.errorMessage).toHaveText(ErrorMessages.usernameRequired);
  });

  test('empty password shows required error', { tag: '@regression' }, async ({ loginPage }) => {
    await loginPage.login({ ...users.standard, password: '' });

    await expect(loginPage.errorMessage).toHaveText(ErrorMessages.passwordRequired);
  });

  test('performance glitch user logs in despite delay', { tag: '@regression' }, async ({ loginPage, inventoryPage }) => {
    await loginPage.login(users.performanceGlitch);

    await expect(inventoryPage.title).toHaveText('Products', { timeout: 10_000 });
  });
});