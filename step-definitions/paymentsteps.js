const {
  Given,
  When,
  Then,
  Before,
  After
} = require('@cucumber/cucumber');

const { getPaymentData } = require('../utils/testDataReader');
const { buildPaymentRequest,generateMessageId } = require('../utils/paymentRequestBuilder');
const { ApiClient } = require('../client/apiClient');
const {
  validatePaymentStatus,
  validatePaymentFields
} = require('../utils/responseValidator');
const { request } = require('playwright');

Before(async function () {
  this.apiRequest = await request.newContext();
});

After(async function () {
  if (this.apiRequest) {
    await this.apiRequest.dispose();
  }
});

Given(
  'I load payment test data for {string} and {string} from sheet {string} using template {string}',
  async function (testCaseNo, testDataNo, sheetName, jsonTemplate) {
    this.data = await getPaymentData(
      jsonTemplate,
      sheetName,
      testCaseNo,
      testDataNo
    );

// Generate fresh Message ID
this.data.messageIdentification = generateMessageId();

    this.payload = buildPaymentRequest(this.data);

    console.log('Test Case:', testCaseNo);
    console.log('Test Data:', testDataNo);
    console.log('Request template:', jsonTemplate);
    console.log('Request payload prepared successfully');
  }
);

When(
  'I submit the payment request to the payment API',
  async function () {
    const baseUrl = process.env.example.BASE_URL;
    const paymentEndpoint = process.env.example.PAYMENT_ENDPOINT;

    if (!baseUrl || !paymentEndpoint) {
      throw new Error(
        'BASE_URL and PAYMENT_ENDPOINT must be configured in the project .env file.'
      );
    }

    const endpoint = new URL(paymentEndpoint, baseUrl).toString();
    console.log('API Endpoint:', endpoint);

    const apiClient = new ApiClient(this.apiRequest, endpoint);

    this.response = await apiClient.postPayment(this.payload, this.data);

    console.log('HTTP Status:', this.response.status());
    console.log('Response URL:', this.response.url());

    const responseText = await this.response.text();
    console.log('Response Body:', responseText);

    try {
      this.responseBody = JSON.parse(responseText);
    } catch (error) {
      throw new Error(
        'API returned a non-JSON response. Check the endpoint and mock server. Response: ' +
        responseText.substring(0, 300)
      );
    }
  }
);

Then(
  'I validate the payment response',
  async function () {
    validatePaymentStatus(this.response, this.data);
    validatePaymentFields(this.responseBody, this.data);
  }
);
