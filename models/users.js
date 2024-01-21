const User = require('./userModel');

const addNewUser = async (newUser) => await User.create(newUser);

module.exports = {
    addNewUser,
}