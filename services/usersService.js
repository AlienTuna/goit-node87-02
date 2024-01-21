const User = require("../models/usersModel")

exports.checkUserByToken = async (token) => {
    const currentUser = await User.findOne({token})

    return currentUser;
}