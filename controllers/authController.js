const bcrypt = require("bcrypt");

const User = require("../models/usersModel");
const { catchAsync, HttpError, userValidators } = require("../utils");
const { jwtServices } = require("../services");

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

module.exports = {
    signupUserController,
    loginUserController,
    logoutUserController,
    currentUserController,
};