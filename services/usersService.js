const User = require("../models/usersModel");
const { HttpError } = require("../utils");
const ImageService = require("./ImageService");
const crypto = require('crypto');

exports.checkUserByToken = async (token) => {
    const currentUser = await User.findOne({ token })

    return currentUser;
}

exports.updateUserAvatarService = async (userData, user, file) => {
    if (file) {
        console.log({ file });
        user.avatar = 'avatars/' + file.filename;
        // user.avatar = file.path.replace('public', '');

        user.avatar = await ImageService.saveImageSwrvice(
            file,
            { maxFileSize: 10, width: 250, height: 250 },
            'avatars',
            user.id
        );
    }
}

exports.verifyUserService = async(otp) => {
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

    const user = await User.findOne({
        verificationToken: hashedOtp,
    })

    if(!user) throw new HttpError(404, 'User not found');

    user.verify = true;
    user.verificationToken = null;

    await user.save();
}