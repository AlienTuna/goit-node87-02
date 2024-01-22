const Joi = require('joi');

exports.registerUserValidator = (data) =>
    Joi
        .object()
        .options({ abortEarly: false })
        .keys({
            password: Joi.string().min(6).required(),
            email: Joi.string().email().required(),
        })
        .validate(data);

exports.loginUserValidator = (data) =>
    Joi
        .object()
        .options({ abortEarly: false })
        .keys({
            password: Joi.string().required(),
            email: Joi.string().required(),
        })
        .validate(data);

exports.sendVerifyEmailValidator = (data) =>
    Joi
        .object()
        .options({ abortEarly: false })
        .keys({
            email: Joi.string().email().required(),
        })
        .validate(data);