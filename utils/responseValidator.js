const { expect } = require('@playwright/test');

function validatePaymentStatus(response, expectedData) {
  const expectedStatus = Number(expectedData.expectedStatus);

  if (!Number.isFinite(expectedStatus)) {
    throw new Error(
      `Invalid expectedStatus in Excel: ${expectedData.expectedStatus}`
    );
  }

  expect(response.status()).toBe(expectedStatus);
}

function validatePaymentFields(responseBody, expectedData) {
  expect(responseBody).toBeTruthy();
  expect(responseBody.code).toBe(String(expectedData.expectedResponseCode));
  expect(responseBody.message).toBe('Payment request accepted');
  expect(responseBody.messageId).toBe(
    String(expectedData.messageIdentification)
  );
  expect(responseBody.paymentStatus).toBe('ACCEPTED');
}

module.exports = {
  validatePaymentStatus,
  validatePaymentFields
};
