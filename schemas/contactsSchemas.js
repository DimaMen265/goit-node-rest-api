const Joi = require("joi");

const createContactSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    phone: Joi.string().required(),
});

const improveContactSchema = Joi.object({
    name: Joi.string(),
    email: Joi.string().email({ minDomainSegments: 2 }),
    phone: Joi.string(),
});

const improveStatusSchema = Joi.object({
    favorite: Joi.boolean().required()
        .messages({ "any.required": "missing field favorite" }),
});

module.exports = {
    createContactSchema,
    improveContactSchema,
    improveStatusSchema,
};
