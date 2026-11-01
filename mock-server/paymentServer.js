require('dotenv').config();

const http = require('http');

const PORT = Number(process.env.MOCK_PORT || 8089);
const PAYMENT_PATH = process.env.PAYMENT_ENDPOINT || '/api/v1/payments';

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST' || req.url !== PAYMENT_PATH) {
    res.writeHead(404);
    res.end(JSON.stringify({
      code: 'NOT_FOUND',
      message: 'Endpoint not found'
    }));
    return;
  }

  let requestBody = '';

  req.on('data', (chunk) => {
    requestBody += chunk;
  });

  req.on('end', () => {
    try {
      const payment = JSON.parse(requestBody);
      const transactionInfo = payment.transactionInfo || {};

      if (
        !payment.messageID ||
        !transactionInfo.transactionID ||
        transactionInfo.paymentAmount === undefined ||
        transactionInfo.paymentAmount === null ||
        transactionInfo.paymentAmount === '' ||
        !transactionInfo.currency
      ) {
        res.writeHead(400);
        res.end(JSON.stringify({
          code: 'RJCT',
          message: 'Required payment fields are missing'
        }));
        return;
      }

      res.writeHead(200);
      res.end(JSON.stringify({
        code: 'ACCP',
        message: 'Payment request accepted',
        messageId: payment.messageID,
        paymentStatus: 'ACCEPTED'
      }));
    } catch (error) {
      res.writeHead(400);
      res.end(JSON.stringify({
        code: 'INVALID_JSON',
        message: 'Request body is not valid JSON'
      }));
    }
  });
});

server.listen(PORT, () => {
  console.log(`Mock payment API running on http://localhost:${PORT}${PAYMENT_PATH}`);
});
