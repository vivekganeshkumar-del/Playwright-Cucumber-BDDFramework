# Playwright + Cucumber Payment API Framework

This project retains the supplied folder structure and uses:
- Cucumber BDD for scenario execution
- Playwright APIRequestContext for HTTP requests
- ExcelJS for reading `test-data/TestData.xlsx`
- JSON request templates under `test-data/request-templates`
- A local Node.js mock payment server for repeatable local execution

## Prerequisites
- Node.js (LTS recommended)
- npm

## Install dependencies
From the project root:

```bash
npm install
```

## Run the mock payment API
Open Terminal 1:

```bash
npm run mock:start
```

The mock server listens at `http://localhost:8089/api/v1/payments`.

## Run the Cucumber scenarios
Open Terminal 2 in the project root:

```bash
npm run test:bdd
```

You can also use:

```bash
npx cucumber-js
```

The HTML report is written to `reports/cucumber-report.html`.

## Framework flow
1. `features/payment.feature` supplies test case ID, test data ID, worksheet and JSON template.
2. `step-definitions/paymentsteps.js` reads Excel data and builds the request.
3. `utils/testDataReader.js` finds the matching row in the workbook.
4. `utils/paymentRequestBuilder.js` replaces JSON placeholders with Excel values.
5. `client/apiClient.js` submits the request using Playwright APIRequestContext.
6. `utils/responseValidator.js` checks HTTP status and business response fields.
7. `mock-server/paymentServer.js` returns a deterministic mock response.

## Important note about request templates
The supplied ZIP contained only `pacs008-standard.json`. The feature outline previously shared in the conversation referenced `pacs008-email.json` and `pacs009-standard.json`, so matching template files have been added to make all five examples executable against this project's mock server contract. These are mock-server payload templates with the same simplified request shape; they are **not complete ISO 20022 pacs.008 or pacs.009 message schemas**. Replace them with your approved message structures when connecting to a real banking API.

## Excel columns used
The current workbook contains:
`TC_NO`, `TD_NO`, `messageIdentification`, `amount`, `currency`,
`x-fapi-financial-id`, `x-request-id`, `x-app-id`, `x-client-id`,
`true-client-ip`, `expectedStatus`, and `expectedResponseCode`.

The request template placeholders intentionally match the Excel column names:
- `messageIdentification*****`
- `TD_NO*****`
- `amount*****`
- `currency*****`

The mock server returns `code: ACCP`, matching the workbook's `expectedResponseCode` column.

## Secrets
The supplied workbook does not contain bearer-token or client-secret columns. The API client therefore sends the client/request headers that are actually present in the workbook and does not invent credentials.
