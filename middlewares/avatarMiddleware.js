const multer = require('multer');
const path = require('path');
// const {uuid} = require('uuidv4');

const { HttpError } = require('../utils');

const avatarPath = path.join("../", "temp");

// AVATAR for user
const multerStorage = multer.diskStorage({
    destination: avatarPath,
    filename: (req, file, cbk) => {
        const extension = file.mimetype.split('/')[1] // mimetype хранится в виде: 'image/jpeg'

        cbk(null, `${req.user.id}.${extension}`);
    },
});

const multerFilter = (req, file, cbk) => {
    if (file.mimetype.startsWith('image/')) {
        cbk(null, true);
    } else {
        cbk(new HttpError(400, 'Wrong file type'))
    }
};

exports.createAvatarMulter = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    // limits: {
    //     fileSize: 10 * 1024 * 1024,
    // },
}).single('avatar');


// // AVATAR for user
// const multerStorage = multer.diskStorage({
//     destination: (req, file, cbk) => {
//         cbk(null, 'public/avatars');
//     },
//     filename: (req, file, cbk) => {
//         const extension = file.mimetype.split('/')[1] // mimetype хранится в виде: 'image/jpeg'

//         // делаем наименование файла: userid-random.extension
//         // cbk(null, `${req.user.id}-${uuid()}.${extension}`);
//         cbk(null, `${req.user.id}.${extension}`);
//     },
// });

// const multerFilter = (req, file, cbk) => {
//     if (file.mimetype.startsWith('image/')) {
//         cbk(null, true);
//     } else {
//         cbk(new HttpError(400, 'Wrong file type'))
//     }
// };

// exports.createAvatarMulter = multer({
//     storage: multerStorage,
//     fileFilter: multerFilter,
//     // limits: {
//     //     fileSize: 10 * 1024 * 1024,
//     // },
// }).single('avatar');