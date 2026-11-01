const fs = require('fs');
const path = require('path');


let executionCounter = 0;

function generateMessageId() {

    executionCounter++;

    const now = new Date();

    const date =
        String(now.getDate()).padStart(2, '0') +
        String(now.getMonth() + 1).padStart(2, '0') +
        now.getFullYear();

    const time =
        String(now.getHours()).padStart(2, '0') +
        String(now.getMinutes()).padStart(2, '0') +
        String(now.getSeconds()).padStart(2, '0');

    return `POMSGID-${date}-${time}-${String(executionCounter).padStart(3, '0')}`;
}

function buildPaymentRequest(data) {
  const templatePath = path.join(
    process.cwd(),
    'test-data',
    'request-templates',
    data.REQUESTJSON
  );

  let requestJson = fs.readFileSync(
    templatePath,
    'utf8'
  );

  const keys = Object.keys(data);

  for (const key of keys) {
    const placeholder = key + '*****';

    const searchText = JSON.stringify(placeholder);
    const replacement = JSON.stringify(data[key]);

    requestJson = requestJson.replaceAll(
      searchText,
      () => replacement
    );
  }

  const payload = JSON.parse(requestJson);

  return payload;
}

module.exports = { buildPaymentRequest,generateMessageId };