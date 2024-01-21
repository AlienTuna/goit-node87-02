const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')

const { HttpError } = require('../utils');

dotenv.config({path: './envs/dev.env'});
const { JWT_SECRET, JWT_EXPIRES } = process.env;

exports.signToken = (id) => jwt.sign({id}, JWT_SECRET, { expiresIn: JWT_EXPIRES });

exports.checkToken = (token) => {
    if(!token) throw new HttpError(401, 'Not authorized');

    try {
        const {id} = jwt.verify(token, JWT_SECRET);
        return id;
    } catch (error) {
        throw new HttpError(401, 'Not authorized');
    }
}