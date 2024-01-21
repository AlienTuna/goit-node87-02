const authController = require('../controllers/authController');

const express = require('express');
const { authMiddleware,
    avatarMiddleware
} = require('../middlewares');
const authRouter = express.Router();


authRouter.post('/signup', authController.signupUserController);

authRouter.post('/login', authController.loginUserController);

authRouter.use(authMiddleware.checkTokenMW);

authRouter.post('/logout', authController.logoutUserController);

authRouter.get('/current', authController.currentUserController);

authRouter.patch('/qwe', authController.currentUserController);

authRouter.patch('/avatars',
    avatarMiddleware.createAvatarMulter,
    authController.updateAvatar
);

module.exports = authRouter;