const {
  getMeshState,
  runGossipRound,
  flushBridge,
  resetMesh
} = require("../services/meshService");

const {
  clearCache
} = require("../services/idempotencyService");

exports.meshState = (req, res) => {
  res.json(getMeshState());
};

exports.gossip = (req, res) => {

  const result =
    runGossipRound();

    global.io.emit(
  "gossipStarted"
);

  res.json(result);

};

exports.flush = async (req, res) => {

  const result =
    await flushBridge();

  res.json(result);

  global.io.emit(
  "packetSettled",
  result
);

};

exports.reset = (req, res) => {

  clearCache();

  resetMesh();

  res.json({
    message:
      "Mesh Reset Successfully"
  });

};