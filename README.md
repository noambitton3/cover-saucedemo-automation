# SauceDemo E2E Automation – Playwright + TypeScript

[![Playwright Tests](https://github.com/noambitton3/cover-saucedemo-automation/actions/workflows/playwright.yml/badge.svg)](https://github.com/noambitton3/cover-saucedemo-automation/actions/workflows/playwright.yml)

End-to-end test automation for **[SauceDemo](https://www.saucedemo.com)**, a demo e-commerce site by Sauce Labs.
The suite covers the main user flows: **Login, Products, Cart, Checkout and Navigation**. It has 30 tests, and each one runs on Chromium, Firefox and WebKit.

📋 [TEST_PLAN.md](TEST_PLAN.md)

Scope, test cases and bugs found (in Hebrew).

### 📊 Live Allure Report
https://noambitton3.github.io/cover-saucedemo-automation/

Updated on every push to `main`.

---

## Prerequisites

| Tool | Version | Why it's needed |
|---|---|---|
| [Node.js](https://nodejs.org) | 20 or newer (LTS recommended) | Runs Playwright and the TypeScript tests |
| npm | 10 or newer (installed with Node.js) | Installs the project's dependencies and runs the test scripts |
| Git | any | Clones the repository |
| [Java](https://adoptium.net) | 8 or newer | **Only** needed to generate the Allure report locally |

---

## Installation & Run

1. **Clone the repository**
   ```bash
   git clone https://github.com/noambitton3/cover-saucedemo-automation.git
   cd cover-saucedemo-automation
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   This also downloads the Playwright browsers automatically, through a `postinstall` script.

3. **Run the tests**
   ```bash
   npm test
   ```
   Runs all tests on Chromium, Firefox and WebKit.

No `.env` setup is needed. Default values are loaded from `.env.example`, as explained in [Environment Variables](#environment-variables).

---

## Running the Tests

| What | Command |
|---|---|
| All tests on all browsers (headless, default) | `npm test` |
| All tests in headed mode (browser window visible) | `npx playwright test --headed` |
| One browser only | `npx playwright test --project=chromium` |
| A single test file | `npx playwright test tests/login.spec.ts` |
| A single test by name | `npx playwright test -g "standard user logs in successfully"` |
| A single test by line | `npx playwright test tests/login.spec.ts:9` |
| Smoke tests only (`@smoke`) | `npm run test:smoke` |
| Regression tests (`@regression`) | `npx playwright test --grep @regression` |
| UI mode (interactive runner) | `npx playwright test --ui` |
| Debug mode (step through) | `npx playwright test --debug` |
| TypeScript type check | `npm run typecheck` |

**Headless vs. headed:**
- **Headless** (default): the browser runs in the background with no visible window. This is faster, and it is how the tests run in CI.
- **Headed** (`--headed`): a real browser window opens, so you can watch each step. This is useful when writing or debugging a test.

You can combine options, for example `npx playwright test tests/cart.spec.ts --project=firefox --headed`.

### Tags

| Tag | Meaning |
|---|---|
| `@smoke` | One critical happy-path test per area (5 tests). This is a quick sanity check. |
| `@regression` | All tests, the full suite. |

---

## Viewing the Reports

### Playwright HTML report (built-in)
An HTML report is generated in `playwright-report/` after every run. To open it:
```bash
npm run report
```
For failed tests, the report includes a **screenshot**, a **video** and a **trace**. Open the trace from the report to step through the test in the Trace Viewer.

### Allure report
`allure-playwright` and `allure-commandline` are installed with `npm install`. Generating the report locally needs **Java 8 or newer**.

```bash
# Generate and open in one step (temporary report)
npx allure serve allure-results

# Or generate a static report and open it
npx allure generate allure-results -o allure-report --clean
npx allure open allure-report
```

The **live Allure report**, with run history and trends, is published to GitHub Pages by CI:
https://noambitton3.github.io/cover-saucedemo-automation/

### CI artifacts
Each GitHub Actions run uploads the `playwright-report` and the `test-results` (screenshots, videos and traces) as downloadable artifacts. They are kept for 14 days. You can find them on the run's page under **Actions**.

---

## Project Structure

```
cover-saucedemo-automation/
├── .github/workflows/
│   └── playwright.yml        # CI: type check → tests → artifacts → Allure report to GitHub Pages
├── components/
│   └── HeaderComponent.ts    # Shared header: cart icon/badge and side menu (open, close, links)
├── data/
│   └── testData.ts           # Test data: users, checkout info, expected error messages, product names
├── fixtures/
│   └── fixtures.ts           # Custom Playwright fixtures that inject ready-made page objects into tests
├── pages/                    # Page Object Model – one class per page
│   ├── LoginPage.ts
│   ├── InventoryPage.ts      # Products list: items, sorting, add/remove
│   ├── ProductPage.ts        # Product details page
│   ├── CartPage.ts
│   ├── CheckoutInfoPage.ts   # Checkout step 1 – customer information form
│   ├── CheckoutSummaryPage.ts# Checkout step 2 – order summary and totals
│   └── CheckoutCompletePage.ts
├── tests/                    # Test specs, one file per area
│   ├── login.spec.ts
│   ├── products.spec.ts
│   ├── cart.spec.ts
│   ├── checkout.spec.ts
│   └── navigation.spec.ts
├── types/
│   └── index.ts              # Shared TypeScript types (User, CheckoutInfo, SortOption)
├── utils/
│   └── envReader.ts          # Reads a required environment variable and fails clearly if it is missing
├── .env.example              # Environment variables template with default values
├── playwright.config.ts      # Browsers, reporters, base URL, retries, screenshots/videos/traces
├── tsconfig.json             # TypeScript settings (strict mode)
├── TEST_PLAN.md              # Test plan (Hebrew)
└── package.json              # Dependencies and npm scripts
```

### Design highlights
- **Page Object Model.** Locators and actions live in page classes, and tests only describe the flow and the checks. The header and side menu appear on every page, so they are a separate component.
- **Custom fixtures.** Tests receive page objects as parameters, such as `async ({ inventoryPage, cartPage }) => ...`, without creating them by hand.
- **Stable locators.** The tests prefer the site's `data-test` attributes (`getByTestId`) and accessible roles (`getByRole`) over CSS classes.
- **Readable reports.** `test.step` splits long flows into named steps. `expect.soft` is used for independent checks on the same screen, so one failure doesn't hide the others.
- **Known bugs.** Bugs found in the site are covered by tests marked with `test.fail()`. They pass while the bug exists and will alert when it is fixed. See the bug list in the [Test Plan](TEST_PLAN.md).
- **Cross-browser.** Every test runs on Chromium, Firefox and WebKit, and runs in parallel.
- **Type safety.** TypeScript runs in `strict` mode, and CI runs a type check before the tests.

---

## Technologies

- **[Playwright Test](https://playwright.dev)**: test runner and browser automation
- **TypeScript**: strict mode
- **Node.js / npm**
- **dotenv**: loads environment variables
- **Allure** (`allure-playwright`, `allure-commandline`): extended reporting
- **GitHub Actions**: CI
- **GitHub Pages**: hosts the Allure report

---

## Bonus Features Implemented

| Bonus | Implementation |
|---|---|
| **CI/CD with GitHub Actions** | [`.github/workflows/playwright.yml`](.github/workflows/playwright.yml) runs on every push and pull request to `main`, and can also be started manually. It runs a type check, then all tests on 3 browsers, then uploads the reports as artifacts. The password comes from a GitHub Actions secret. |
| **Allure report (with installation instructions)** | Local setup is described in [Viewing the Reports](#allure-report). CI publishes the report with **run history** to [GitHub Pages](https://noambitton3.github.io/cover-saucedemo-automation/). |
| **Test tags** | `@smoke` and `@regression`. Run them with `npm run test:smoke` or `--grep @regression`. |

---

## Environment Variables

The tests read the site URL and the user credentials from environment variables:

| Variable | Description |
|---|---|
| `BASE_URL` | Site under test |
| `STANDARD_USER` | Regular user |
| `LOCKED_OUT_USER` | User that is blocked from logging in |
| `PROBLEM_USER` | User with known UI bugs |
| `PERFORMANCE_GLITCH_USER` | User with a slow login |
| `PASSWORD` | Shared password for all users |

Values are loaded in this order:
1. Variables that already exist in the environment, such as CI secrets, are never overridden.
2. `.env`, if it exists. It is git-ignored and used for local overrides.
3. `.env.example`, which fills in any missing values.

> **About the password:** SauceDemo's credentials are public demo values shown on the site's login page, so they are kept in `.env.example` to allow a 3-step run. In a real project, `.env.example` would hold empty placeholders and the secrets would live only in `.env` and CI secrets. This project's CI already reads `PASSWORD` from a GitHub Actions secret.

---

## Future Improvements

- Log in once and reuse the session (`storageState`) to shorten the test runs.
- Automate more of the bugs documented in the [Test Plan](TEST_PLAN.md). Today 2 of the 16 bugs are covered with `test.fail()`.
- Cover `visual_user` and `error_user` with dedicated tests.
