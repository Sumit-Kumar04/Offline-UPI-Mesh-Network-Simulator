const crypto = require("crypto");

exports.hashPacket = (
  ciphertext
) => {

  return crypto
    .createHash("sha256")
    .update(
      JSON.stringify(ciphertext)
    )
    .digest("hex");

};