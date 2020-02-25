const Joi = require('@hapi/joi');
// Register Validation 
const registerValidation = data => {
    const schema = Joi.object({
        Username : Joi.string()
            .min(6)
            .required(),
        Password : Joi.string()
            .min(8)
            .required(),
        Name : Joi.string()
            .min(2)
            .required(),
        Email : Joi.string()
            .required()
            .email()
    });
    return schema.validate(data);
};

// Login Validation 
const loginValidation = data => {
    const schema = Joi.object({
        Username : Joi.string()
            .min(6)
            .required(),
        Password : Joi.string()
            .min(8)
            .required()
    });
    return schema.validate(data);
};


module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;