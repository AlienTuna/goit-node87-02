const bcrypt = require("bcrypt");
const fs = require('fs/promises');
const path = require("path");
const Jimp = require("jimp");
// const nodemailer = require('nodemailer');

const User = require("../models/usersModel");
const { catchAsync, HttpError, userValidators } = require("../utils");
const { jwtServices, usersService, EmailService } = require("../services");

const signupUserController = catchAsync(async (req, res) => {
    const { error } = userValidators.registerUserValidator(req.body);
    if (error) throw new HttpError(400, error);

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
    const { error } = userValidators.loginUserValidator(req.body);
    if (error) throw new HttpError(400, error);

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

const veryfyUserController = catchAsync(async (req, res) => {
    const { verificationToken } = req.params;

    /* SIMPLyfied variant
    const user = await User.findOne({ verificationToken });
    console.log(user, verificationToken)
    if (!user) throw new HttpError(404, 'User not found');
    await User.findByIdAndUpdate(user.id, {verify: true, verificationToken: null})
    */

    usersService.verifyUserService(verificationToken);

    res.status(200).json({ message: 'Verification successful' });
})

const sendVerifyEmailController = catchAsync(async (req, res) => {
    const { email } = req.body;
    if (!email) throw new HttpError(400, 'Missing email');

    const user = await User.findOne({ email });
    if (!user) throw new HttpError(404, 'User not found');

    const { error } = userValidators.sendVerifyEmailValidator(req.body);
    if (error) throw new HttpError(400, error);
    if (user.verify) throw new HttpError(400, 'Verification has already been passed');



    const otp = user.createVerifyToken();

    await user.save();


    try {
        // должен быть адрес фронта, так нельзя делать:
        const verifyUrl = `${req.protocol}://${req.get('host')}/api/users/verify/${otp}`

        console.log('verify url: ',verifyUrl);
        await EmailService(user, verifyUrl).sendVerificationEmail();
        // //SIMPLE variant
        //         
        // const emailTransport = nodemailer.createTransport({
        //     host: 'smtp.mailgun.org',
        //     port: 587 ,
        //     auth: {
        //         user: 'postmaster@sandbox35220b3fee8343a4b88c663501177283.mailgun.org',
        //         pass: '9cddfa46cc7c56ffcabe7f1a160a180e-063062da-34d5bb46',
        //     }
        //     // 4d60573d93aa549692510a6ec3073076-063062da-2e2c845f
        // })

        // const verifyEmailConf = {
        //     from: 'Phonebook App <phonebook-admin@example.com>',
        //     to: email,
        //     subject: "Verification for your email",
        //     // text: verifyUrl,
        //     html: `<p style="margin: 0;">Tap the button below to confirm your email address. </p><a href="${verifyUrl}" target="_blank" style="display: inline-block; padding: 16px 36px; margin:20px; font-size: 20px; color: #ffffff; text-decoration: none; border-radius: 6px; border: solid grey; background: grey">Verify</a><p>Or copy this link to browser: ${verifyUrl}</p>`,
        // }
        // await emailTransport.sendMail(verifyEmailConf);

        res.json({ message: "Verification email sent" });
        console.log('Link was sent',verifyUrl);
    } catch (error) {
        throw new HttpError(500, 'Email service unavailable')
    }

    //     POST /users/verify
    //     Content-Type: application/json
    //     RequestBody: {
    //       "email": "example@example.com"
    //     }
    //     Resending a email validation error
    // Status: 400 Bad Request
    // Content-Type: application/json
    // ResponseBody: <Error from Joi or another validation library>
    // Resending a email success response
    // Status: 200 Ok
    // Content-Type: application/json
    // ResponseBody: {
    //   "message": "Verification email sent"
    // }
    // Resend email for verified user
    // Status: 400 Bad Request
    // Content-Type: application/json
    // ResponseBody: {
    //   message: "Verification has already been passed"
    // }

    // if () throw new HttpError(404, { message: 'User not found' });
    res.status(200).json({ message: 'Verification email sent' });
})


module.exports = {
    signupUserController,
    loginUserController,
    logoutUserController,
    currentUserController,
    uploadUserAvatar,
    updateAvatar,
    veryfyUserController,
    sendVerifyEmailController,
};