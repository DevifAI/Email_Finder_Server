const axios = require("axios");

const verifyEmail = async (email) => {
  try {
    const response = await axios.get("https://api.mails.so/v1/validate", {
      params: { email },
      headers: {
        "x-mails-api-key": process.env.MAILS_API_KEY, // Store API key in .env
      },
    });

    return response.data; // or response.data.status, depending on what you need
  } catch (error) {
    console.error("Email verification error:", error.message);
    return null;
  }
};

module.exports = verifyEmail;
