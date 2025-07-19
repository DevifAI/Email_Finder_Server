const axios = require("axios");
const base64 = require("base-64");

const PAYPAL_BASE = "https://api-m.sandbox.paypal.com";

async function getAccessToken() {
  const auth = base64.encode(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
  );

  const response = await axios.post(
    `${PAYPAL_BASE}/v1/oauth2/token`,
    "grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return response.data.access_token;
}

async function createOrder(amount = "10.00") {
  const accessToken = await getAccessToken();

  const response = await axios.post(
    `${PAYPAL_BASE}/v2/checkout/orders`,
    {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: amount,
          },
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
}

async function captureOrder(orderID) {
  const accessToken = await getAccessToken();

  const response = await axios.post(
    `${PAYPAL_BASE}/v2/checkout/orders/${orderID}/capture`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
}

module.exports = {
  createOrder,
  captureOrder,
};
