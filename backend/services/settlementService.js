const Account = require("../models/Account");
const Transaction = require("../models/Transaction");

exports.settlePayment = async (
  payment,
  packetHash
) => {

  const sender =
    await Account.findOne({
      name: payment.sender
    });

  const receiver =
    await Account.findOne({
      name: payment.receiver
    });

  if (!sender || !receiver) {
    throw new Error(
      "Account not found"
    );
  }

  if (sender.balance < payment.amount) {
    throw new Error(
      "Insufficient balance"
    );
  }

  sender.balance -= payment.amount;

  receiver.balance += payment.amount;

  await sender.save();
  await receiver.save();

  const transaction =
    await Transaction.create({
      sender: payment.sender,
      receiver: payment.receiver,
      amount: payment.amount,
      packetHash
    });

  return transaction;
};