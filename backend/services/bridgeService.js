const {
  decrypt
} = require("./cryptoService");



const {
  hashPacket
} = require("./hashService");

const {
  settlePayment
} = require("./settlementService");

exports.ingestPacket = async (packet) => {

  const packetHash =
    hashPacket(packet.ciphertext);

  const claimed =
    claimPacket(packetHash);

  if (!claimed) {
    return {
      outcome: "DUPLICATE_DROPPED"
    };
  }

  const payment =
    decrypt(
      packet.ciphertext.encryptedData,
      packet.ciphertext.iv
    );

  const transaction =
    await settlePayment(
      payment,
      packetHash
    );

  return {
    outcome: "SETTLED",
    transaction
  };
};

const {
 claimPacket
} = require(
 "./idempotencyService"
);