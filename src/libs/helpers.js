const bcrypt = require('bcryptjs');
const helpers = {};

helpers.encryptPassword = password => {
    const salt = await bcrypt.getSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

helpers.matchPassword = (password, savedPassword) => {
    try {
        return await bcrypt.compare(password, savedPassword);
    } catch (err) {
        console.error(err);
    }
}

module.exports = helpers;