# OrangeHRM Playwright Automation

End-to-end UI automation for the OrangeHRM demo application, built with Playwright Test and a page-object model. The configured browser project is Chromium; Playwright HTML reports, screenshots, videos, and traces are collected for test runs.

## Requirements

- Node.js 22 (also configured as `NodeJS-22` in the Jenkins pipeline)
- npm
- Access to an OrangeHRM environment and a test account

## Setup

Install the Node.js dependencies and Chromium browser:

```bash
npm install
npx playwright install chromium
```

Create a `.env` file in the project root with the application login URL and test account credentials:

```dotenv
URL=https://opensource-demo.orangehrmlive.com/web/index.php/auth/login
User_Name=your_test_username
Password=your_test_password
```

Keep credentials out of source control. `.env` and the generated Playwright authentication state are ignored by Git.

## Run Tests

```bash
# Smoke tests
npm run smokeTest

# Full configured suite (smoke, regression, and setup where applicable)
npm run regressionTest
```

The Playwright `setup` project runs the login setup and saves authenticated browser state to `StorageState/playwrightStorageState/auth.json`. The Chromium project depends on this setup. The valid-login smoke test intentionally starts without saved authentication state.

To run a specific test file or inspect available options:

```bash
npx playwright test tests/smoke/TC_03.spec.js
npx playwright test --list
```

## Test Coverage

- `tests/smoke/`: valid and invalid login, Admin navigation, employee search, dashboard widgets, and changing the current user's password.
- `tests/regressionTesting/`: employee creation, including generated employee details and profile-picture upload.
- `tests/auth.setup.js`: creates the authenticated storage state used by authenticated tests.

The password-change test modifies the account password. Run it only when you can manage or restore the test account credentials. The employee-creation test writes generated values to `TestData/employeeGeneratedData.json` and expects `customFolder/uploadFolder/profilePicture.png` to exist.

## Project Layout

```text
delta_Page_Object_Model/   Page objects grouped by OrangeHRM module
delta_Utility/             Shared browser-action and data utilities
Fixtures/                  Shared Playwright fixture
StorageState/              Saved browser authentication state
TestData/                  Employee test data
tests/
  auth.setup.js             Authentication setup
  smoke/                    Smoke test specs
  regressionTesting/        Regression test specs
customFolder/uploadFolder/  File upload test asset
playwright.config.js        Playwright projects, browser, and reporting settings
Jenkinsfile                 Jenkins pipeline
```

## Reports and Diagnostics

The configured reporter creates an HTML report in `playwright-report/`. Open it with:

```bash
npx playwright show-report
```

On failures, Playwright retains screenshots, videos, and traces according to `playwright.config.js`; test artifacts are written under `test-results/`.

## Jenkins

The pipeline accepts a test suite (`smokeTest` or `regressionTest`) and an application URL. Configure the Jenkins credential with ID `admin_credentials` and provide the Node.js installation named `NodeJS-22`. The pipeline passes the URL and credential values to the Playwright process and archives the HTML report.
