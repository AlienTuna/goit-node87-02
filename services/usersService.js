const User = require("../models/usersModel");
const ImageService = require("./ImageService");

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