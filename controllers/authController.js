const bcrypt = require("bcrypt");
const fs = require('fs/promises');
const path = require("path");
const Jimp = require("jimp");

const User = require("../models/usersModel");
const { catchAsync, HttpError, userValidators } = require("../utils");
const { jwtServices, usersService } = require("../services");

const signupUserController = catchAsync(async (req, res) => {
    const {error} = userValidators.registerUserValidator(req.body);
    if(error) throw new HttpError(400, error);

    const { email, password } = req.body;

    const userDouble = await User.findOne({ email });
    if (userDouble) throw new HttpError(409, 'Email in use');

    const hashPassword = await bcrypt.hash(password, 10);
    const result = await User.create({ ...req.body, password: hashPassword });
    
    res.status(201).json({
        user: {
            email: result.email,
            subscription: result.subscription,
        },
    });
})

const loginUserController = catchAsync(async (req, res) => {
    const {error} = userValidators.loginUserValidator(req.body);
    if(error) throw new HttpError(400, error);
    
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    // console.log('###USER###', user);
    // console.log('###USER_ID###', user.id);
    if (!user) throw new HttpError(401, 'Email or password is wrong')

    const passwdIsValid = await bcrypt.compare(password, user.password);
    if (!passwdIsValid) throw new HttpError(401, 'Email or password is wrong');

    user.password = undefined;

    const token = jwtServices.signToken(user.id);

    await User.findByIdAndUpdate(user.id, { token });

    res.json({
        token,
        user: {
            email,
            subscription: user.subscription,
        },
    });
})

const logoutUserController = catchAsync(async (req, res) => {
    const { id } = req.user;
    if (!id) throw new HttpError(401, "Not authorized");

    await User.findByIdAndUpdate(id, { token: null });
    res.status(204).json();
})

const currentUserController = catchAsync(async (req, res) => {
    const { email, subscription } = req.user;
    res.json({
        email,
        subscription,
    });
});

const uploadUserAvatar = catchAsync(async (req, res) => {
   const updateUserAvatar = await usersService.updateUserAvatarService(req.body, req.user, req.file);

   res.status(200).json({
    avatarURL: req.user.avatar
   });

   return updateUserAvatar;
});

const updateAvatar = catchAsync(async (req, res, next) => {
    if (!req.file) throw new HttpError(400, 'Missing image file')

    const avatarsPath = path.resolve('public', 'avatars');
  
    const { path: oldPath } = req.file;
    const userId = req.user.id;
  
    const jimpAvtar = await Jimp.read(oldPath);
    await jimpAvtar.resize(250, 250).quality(60).write(oldPath);

    const extension = req.file.mimetype.split('/')[1]
    const newName = `${userId}.${extension}`;
    const newPath = path.join(avatarsPath, newName);
    const avatarURL = path.join('avatars', newName);

    await fs.rename(oldPath, newPath);
    
  
    await User.findByIdAndUpdate(userId, { avatarURL });
  
    res.status(200).json({ avatarURL });
  });

module.exports = {
    signupUserController,
    loginUserController,
    logoutUserController,
    currentUserController,
    uploadUserAvatar,
    updateAvatar
};