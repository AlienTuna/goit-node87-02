const multer = require('multer');
const path = require('path');
const uuid = require('uuid').v4;
const fse = require('fs-extra');

const { HttpError } = require('../utils');
const Jimp = require('jimp');

/**
 * Image upload service class
 */
class ImageService {
    static initUploadImageMiddleware(name) {
        const multerStorage = multer.memoryStorage();

        const multerFilter = (req, file, cbk) => {
            if (file.mimetype.startsWith('image/')) {
                cbk(null, true);
            } else {
                cbk(new HttpError(400, 'Please, upload images only!!'), false);
            }
        };

        return multer({
            storage: multerStorage,
            fileFilter: multerFilter,
        }).single('avatar');
    }

    // 'images', 'users', '<userID>', '<fileName>'
    static async saveImageService(file, options, ...pathSegments) {
        if (file.size > (options?.maxFileSize ? options.maxFileSize * 1024 * 1024 : 1 * 1024 * 1024)) {
            throw new HttpError(400, 'File is too large!');
        }

        const fileName = `${uuid()}.jpeg`;
        const fullFilePath = path.join(process.cwd(), 'public', ...pathSegments);

        await fse.ensureDir(fullFilePath); // создание директории, если она отсутствует

        const avatar = await Jimp.read(file.buffer);
        await avatar
            .cover(options.width || 500, options.height || 500)
            .quality(90)
            .writeAsync(path.join(fullFilePath, fileName));

;

        // return path.join(...pathSegments, fileName);
    }
}

module.exports = ImageService;

/* Jimp example
const avatar = await jimp.read(file.buffer);
await avatar
  .cover(options.width || 500, options.height || 500)
  .quality(90)
  .writeAsync(path.join(fullFilePath, fileName));
*/

/* sharp example
        // await sharp(file.buffer)
        //     .resize({ height: options?.height ?? 300, width: options?.width ?? 300 })
        //     .toFormat('jpeg')
        //     .jpeg({ quality: 90 })
        //     .toFile(path.join(fullFilePath, fileName))
*/