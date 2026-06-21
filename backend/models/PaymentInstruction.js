class PaymentInstruction {
  constructor(
    sender,
    receiver,
    amount,
    timestamp,
    nonce
  ) {
    this.sender = sender;
    this.receiver = receiver;
    this.amount = amount;
    this.timestamp = timestamp;
    this.nonce = nonce;
  }
}

module.exports = PaymentInstruction;