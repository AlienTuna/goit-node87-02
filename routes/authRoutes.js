const authController = require('../controllers/authController');

const express = require('express');
const { authMiddleware } = require('../middlewares');
const authRouter = express.Router();


authRouter.post('/signup', authController.signupUserController);

authRouter.post('/login', authController.loginUserController);


authRouter.use(authMiddleware.checkTokenMW);

authRouter.post('/logout', authController.logoutUserController);

authRouter.get('/current', authController.currentUserController);

module.exports = authRouter;