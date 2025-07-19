const { createOrder, captureOrder } = require("../utils/paypalServices");

const createOrderHandler = async (req, res) => {
  try {
    const order = await createOrder();
    res.json({ id: order.id });
  } catch (err) {
    console.error("Create Order Error:", err.message);
    res.status(500).json({ error: "Failed to create order" });
  }
};

const captureOrderHandler = async (req, res) => {
  try {
    const { orderID } = req.params;
    const result = await captureOrder(orderID);
    res.json(result);
  } catch (err) {
    console.error("Capture Order Error:", err.message);
    res.status(500).json({ error: "Failed to capture order" });
  }
};

module.exports = {
  createOrderHandler,
  captureOrderHandler,
};
