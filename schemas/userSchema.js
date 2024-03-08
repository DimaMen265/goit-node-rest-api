const Joi = require("joi");

const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    subscription: Joi.string(),
    avatarURL: Joi.string(),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

const updateSubscriptionSchema = Joi.object({
    subscription: Joi.string().valid("starter", "pro", "business").required(),
});

const verificationEmailSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.email": "Email must be a valid address",
        "any.required": "Missing required email field",
    }),
});

module.exports = {
    registerSchema,
    loginSchema,
    updateSubscriptionSchema,
    verificationEmailSchema,
};
