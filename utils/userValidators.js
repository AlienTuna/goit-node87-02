const Joi = require('joi');

exports.registerUserValidator = (data) =>
    Joi
        .object()
        .options({ abortEarly: false })
        .keys({
            password: Joi.string().min(6).required().messages({"any.required": `missed required password field`,}),
            email: Joi.string().email().required().messages({"any.required": `missed required email field`,}),
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