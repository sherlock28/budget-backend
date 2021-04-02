const bcrypt = require("bcryptjs");
const helpers = {};
const saltRounds = 10;

helpers.encryptPassword = async password => {
  const salt = await bcrypt.genSaltSync(saltRounds);
  const hash = await bcrypt.hashSync(password, salt);
  return hash;
};

helpers.validatePassword = async (password, savedPassword) => {
  try {
    return await bcrypt.compare(password, savedPassword);
  } catch (err) {
    console.error(err);
  }
};

module.exports = helpers;
