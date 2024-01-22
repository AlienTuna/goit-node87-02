// const { usersService } = require("../services");
// const { jwtServices } = require("../services");
const { usersService } = require("../services");
const { HttpError, catchAsync } = require("../utils");

exports.checkTokenMW = catchAsync(async (req, res, next) => {
    const token = req.headers.authorization?.startsWith('Bearer ') && req.headers.authorization.split(' ')[1];
    const currentUser = await usersService.checkUserByToken(token);
    
    if(!currentUser && !currentUser?.id) throw new HttpError(401, 'Not authorized');

    req.user = currentUser;

    next();
})