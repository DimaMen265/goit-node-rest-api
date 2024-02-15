const contactsService = require("../services/contactsServices.js");
const HttpError = require("../helpers/HttpError.js");
const { createContactSchema, updateContactSchema } = require("../schemas/contactsSchemas.js");

const getAllContacts = (req, res) => {
    const result = contactsService.listContacts();
    res.status(200).json(result);
};

const getOneContact = (req, res) => {
    const { id } = req.params;
    const result = contactsService.getContactById(id);

    if (!result) {
        throw HttpError(404);
    };

    res.status(200).json(result);
};

const deleteContact = (req, res) => {
    const { id } = req.params;
    const result = contactsService.deleteContact(id);

    if (!result) {
        throw HttpError(404);
    };

    res.status(204).json(result);
};

const createContact = (req, res) => {
    const { error } = createContactSchema.validate(req.body);

    if (error) {
        throw HttpError(400, error.message);
    };

    const result = contactsService.addContact(req.body);

    res.status(201).json(result);
};

const updateContact = (req, res) => {
    const { id } = req.params;
    const { error } = updateContactSchema.validate(req.body);
    const result = contactsService.updateContact(id, req.body);
    
    if (Object.keys(req.body).length === 0) {
        throw HttpError(400, "Body must have at least one field");
    };

    if (error) {
        throw HttpError(400, error.message);
    };

    if (!result) {
        throw HttpError(404);
    };

    res.status(200).json(result);
};

module.exports = {
    getAllContacts,
    getOneContact,
    deleteContact,
    createContact,
    updateContact,
};
