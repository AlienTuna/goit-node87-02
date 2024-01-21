// const User = require("../models/usersModel");
const { usersService } = require("../services");
// const { jwtServices } = require("../services");
const { HttpError, catchAsync } = require("../utils");

exports.checkTokenMW = catchAsync(async (req, res, next) => {
    const token = req.headers.authorization?.startsWith('Bearer ') && req.headers.authorization.split(' ')[1];
    // const userId = jwtServices.checkToken(token);
    // try {
    //     console.log('####3');
    //     const userId = await usersService.checkUserByToken(token);
    //     console.log('####4', userId);
    //     const currentUser = await User.findById(userId);
    //     console.log('####5');
    //     req.user = currentUser;
    //     console.log('###USER###',currentUser);
    //     console.log(next)
    // } catch (error) {
    //     throw new HttpError(401, 'Not authorized');
    // }

    const currentUser = await usersService.checkUserByToken(token);
    // console.log('####4', currentUser?.id);
    if(!currentUser && !currentUser?.id) throw new HttpError(401, 'Not authorized');
    // console.log('####5');
    req.user = currentUser;
    // console.log('###USER###', currentUser);
    
    if(!currentUser) throw new HttpError(401, 'Not authorized');


    // return userId;
    next();
})