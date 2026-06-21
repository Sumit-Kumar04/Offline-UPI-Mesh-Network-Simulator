const Account = require("../models/Account");

exports.getAccounts = async (
  req,
  res
) => {
  const accounts =
    await Account.find();

  res.json(accounts);
};

exports.createAccount =
  async (req, res) => {
    const account =
      await Account.create(req.body);

    res.json(account);
  };