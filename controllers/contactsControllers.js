const contactsService = require("../services/contactsServices.js");
const HttpError = require("../helpers/HttpError.js");
const { createContactSchema, improveContactSchema } = require("../schemas/contactsSchemas.js");

const getAllContacts = (req, res) => {
    const contacts = contactsService.listContacts();
    res.status(200).json(contacts);
};

const getOneContact = (req, res) => {
    const { id } = req.params;
    const contact = contactsService.getContactById(id);

    if (!contact) {
        throw HttpError(404);
    };

    res.status(200).json(contact);
};

const removeContact = (req, res) => {
    const { id } = req.params;
    const removedContacts = contactsService.removeContact(id);

    if (!result) {
        throw HttpError(404);
    };

    res.status(204).json(removedContacts);
};

const createContact = (req, res) => {
    const { name, email, phone } = req.body;
    const { error } = createContactSchema.validate({ name, email, phone });

    if (error) {
        throw HttpError(400, error.message);
    };

    const newContact = contactsService.addContact(name, email, phone);

    res.status(201).json(newContact);
};

const improveContact = (req, res) => {
    const { id } = req.params;
    const { name, email, phone } = req.body;
    const { error } = improveContactSchema.validate({ name, email, phone });
    const improvedContact = contactsService.updateContact(id, name, email, phone);
    
    if (!name && !email && !phone && Object.keys(req.body).length === 0) {
        throw HttpError(400, "Body must have at least one field");
    };

    if (error) {
        throw HttpError(400, error.message);
    };

    if (!improvedContact) {
        throw HttpError(404);
    };

    res.status(200).json(improvedContact);
};

const improveStatus = (req, res) => {
    const { id } = req.params;
    const { favorite } = req.body;
    const improvedStatus = contactsService.updateStatus(id, favorite);

    if (typeof favorite !== "boolean") {
        throw HttpError(400, "Favorite must be a boolean value");
    };

    if (!improvedStatus) {
        throw HttpError(404);
    };

    res.status(200).json(improvedStatus);
};

module.exports = {
    getAllContacts,
    getOneContact,
    removeContact,
    createContact,
    improveContact,
    improveStatus,
};
