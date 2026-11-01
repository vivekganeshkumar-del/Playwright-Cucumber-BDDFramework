class ApiClient {
  constructor(request, endpoint) {
    this.request = request;
    this.endpoint = endpoint;
  }

  async postPayment(payload, data) {
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'x-fapi-financial-id': String(data['x-fapi-financial-id']),
      'x-request-id': String(data['x-request-id']),
      'x-app-id': String(data['x-app-id']),
      'x-client-id': String(data['x-client-id']),
      'true-client-ip': String(data['true-client-ip'])
    };

    return this.request.post(this.endpoint, {
      headers,
      data: payload
    });
  }
}

module.exports = { ApiClient };
