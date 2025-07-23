const express = require("express");
const router = express.Router();
const { createOrder } = require("../controllers/paypal.controller");

// POST /api/paypal/create-order
router.post("/create-order", createOrder);

module.exports = router;
