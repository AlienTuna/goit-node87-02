const Joi = require('joi');

exports.addContactValidator = (data) => 
    Joi
        .object()
        .options({ abortEarly: false })
        .keys({
            name: Joi.string().min(2).max(50).required(),
            email: Joi.string().email().required(),
            phone: Joi.string().min(6).max(12).required(),
        })
        .validate(data);

exports.updateContactValidator = (data) => 
    Joi
        .object()
        .options({ abortEarly: false })
        .keys({
            name: Joi.string().min(2).max(50).required(),
            email: Joi.string().email().required(),
            phone: Joi.string().min(6).max(12).required(),
        })
        .validate(data);
