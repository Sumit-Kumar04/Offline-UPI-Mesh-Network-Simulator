const express = require("express");

const router = express.Router();

const {
  meshState,
  gossip,
  flush,
  reset
} = require("../controllers/meshController");

router.get("/state", meshState);

router.post("/gossip", gossip);

router.post("/flush", flush);

router.post("/reset", reset);

module.exports = router;