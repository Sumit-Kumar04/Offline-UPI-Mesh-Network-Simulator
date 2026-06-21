const crypto = require("crypto");

const SECRET_KEY =
  crypto.randomBytes(32);

exports.encrypt = (data) => {
  const iv =
    crypto.randomBytes(16);

  const cipher =
    crypto.createCipheriv(
      "aes-256-cbc",
      SECRET_KEY,
      iv
    );

  let encrypted =
    cipher.update(
      JSON.stringify(data),
      "utf8",
      "hex"
    );

  encrypted += cipher.final(
    "hex"
  );

  return {
    iv: iv.toString("hex"),
    encryptedData: encrypted
  };
};

exports.decrypt = (
  encryptedData,
  iv
) => {
  const decipher =
    crypto.createDecipheriv(
      "aes-256-cbc",
      SECRET_KEY,
      Buffer.from(iv, "hex")
    );

  let decrypted =
    decipher.update(
      encryptedData,
      "hex",
      "utf8"
    );

  decrypted += decipher.final(
    "utf8"
  );

  return JSON.parse(decrypted);
};