const { v4: uuidv4 } =
  require("uuid");

const PaymentInstruction =
  require("../models/PaymentInstruction");

const MeshPacket =
  require("../models/MeshPacket");

const {
  encrypt
} = require(
  "../services/cryptoService"
);

   const {
  injectPacket
} = require(
  "../services/meshService"
);


exports.sendPayment =
  async (req, res) => {
    try {
      const {
        sender,
        receiver,
        amount
      } = req.body;

      const payment =
        new PaymentInstruction(
          sender,
          receiver,
          amount,
          Date.now(),
          uuidv4()
        );

      const encrypted =
        encrypt(payment);

      const packet =
        new MeshPacket(
          uuidv4(),
          5,
          Date.now(),
          encrypted
        );

  
injectPacket(
  packet,
  sender
);

global.io.emit(
  "packetInjected",
  packet
);

res.json({
  message:
    "Packet Injected Into Mesh",
  packet
});
    } catch (err) {
      res.status(500).json({
        message: err.message
      });
    }
  };