const authController = require('../controllers/authController');

const express = require('express');
const { authMiddleware,
    avatarMiddleware
} = require('../middlewares');
const authRouter = express.Router();


authRouter.post('/signup', authController.signupUserController, authController.sendVerifyEmailController);

authRouter.post('/login', authController.loginUserController);

authRouter.get('/verify/:verificationToken', authController.veryfyUserController);
authRouter.post('/verify', authController.sendVerifyEmailController);

// protected endpoints
authRouter.use(authMiddleware.checkTokenMW);

authRouter.post('/logout', authController.logoutUserController);

authRouter.get('/current', authController.currentUserController);

authRouter.patch('/avatars',
    avatarMiddleware.createAvatarMulter,
    authController.updateAvatar
);

module.exports = authRouter;