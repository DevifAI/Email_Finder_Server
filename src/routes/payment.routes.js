const express = require("express");
const router = express.Router();
const {
  createOrderHandler,
  captureOrderHandler,
} = require("../controllers/payment.controller");

router.post("/orders", createOrderHandler);
router.post("/orders/capture/:orderID", captureOrderHandler);

module.exports = router;
