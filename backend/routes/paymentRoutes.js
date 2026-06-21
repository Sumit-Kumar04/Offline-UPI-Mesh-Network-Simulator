const express =
  require("express");

const router =
  express.Router();

const {
  sendPayment
} = require(
  "../controllers/paymentController"
);

router.post(
  "/send",
  sendPayment
);

module.exports = router;