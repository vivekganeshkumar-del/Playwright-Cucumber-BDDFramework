Feature: Payment API validation

 @sanity
  Scenario Outline: Validate payment API response

    Given I load payment test data for "<TC_ID>" and "<TD_ID>" from sheet "<SHEET_NAME>" using template "<JSON_TEMPLATE>"

    When I submit the payment request to the payment API

    Then I validate the payment response

    Examples:
  | TC_ID | TD_ID | SHEET_NAME | JSON_TEMPLATE |
  | TC_001 | TD_001 | GetPaymentOption_Positive | pacs008-standard.json |
  | TC_002 | TD_002 | GetPaymentOption_Positive | pacs008-standard.json |
  | TC_003 | TD_003 | GetPaymentOption_Positive | pacs008-email.json    |
  | TC_004 | TD_004 | GetPaymentOption_Positive | pacs008-email.json    |
  | TC_005 | TD_005 | GetPaymentOption_Positive | pacs009-standard.json |


  Scenario Outline: Validate payment API responses

    Given I load payment test data for "<TC_ID>" and "<TD_ID>" from sheet "<SHEET_NAME>" using template "<JSON_TEMPLATE>"

    When I submit the payment request to the payment API

    Then I validate the payment response

    Examples:
      | TC_ID  | TD_ID  | SHEET_NAME                | JSON_TEMPLATE         |
      | TC_010 | TD_010 | GetPaymentOption_Positive | pacs008-standard.json |

      


# To execute i can use these command in the terminal
# npx cucumber-js features/payment.feature
# npm run test:bdd