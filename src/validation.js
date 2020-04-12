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
            .email(),
        roleLevel : Joi.number()
            .allow(1,5,10)
            .only()
            .required(),
        Passcode : Joi.any()
        .when('roleLevel',{
                is : Joi.number().min(5),
                then : Joi.string().required()
            })
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