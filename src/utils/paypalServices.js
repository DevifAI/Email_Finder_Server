const axios = require("axios");
const { getAccessToken } = require("./paypalAuth");

const BASE_URL = "https://api-m.sandbox.paypal.com";

exports.createPaypalOrder = async (amount) => {
  const accessToken = await getAccessToken();

  try {
    const response = await axios.post(
      `${BASE_URL}/v2/checkout/orders`,
      {
        intent: "CAPTURE",
        purchase_units: [{ amount: { currency_code: "USD", value: amount } }],
        application_context: {
          return_url: "http://localhost:3000/success",
          cancel_url: "http://localhost:3000/cancel",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(
      `PayPal order creation failed: ${
        error.response?.data?.message || error.message
      }`
    );
  }
};
