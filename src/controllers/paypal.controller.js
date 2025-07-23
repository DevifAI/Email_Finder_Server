const { createPaypalOrder } = require("../utils/paypalServices");

exports.createOrder = async (req, res) => {
  const { amount } = req.body;

  if (!amount || isNaN(amount)) {
    return res.status(400).json({ message: "Invalid amount provided" });
  }

  try {
    const orderData = await createPaypalOrder(amount);
    const approveLink = orderData.links.find((link) => link.rel === "approve");

    if (!approveLink) {
      return res
        .status(500)
        .json({ message: "Approval link not found in PayPal response" });
    }

    res.status(200).json({
      id: orderData.id,
      links: orderData.links,
    });
  } catch (error) {
    console.error("Error creating PayPal order:", error.message);
    res.status(500).json({
      message: "Failed to create PayPal order",
      error: error.message,
    });
  }
};
