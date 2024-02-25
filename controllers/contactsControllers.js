const { Contact } = require("../models/contact");
const HttpError = require("../helpers/HttpError");

const getAllContacts = async (req, res) => {
    const { _id: owner } = req.user;
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;
    const contacts = await Contact.find({ owner }, "", {
        skip,
        limit: Number(limit),
    }).populate("owner", "name", "email");
    res.status(200).json(contacts);
};

const getOneContact = async (req, res) => {
    const { id } = req.params;
    const { _id: owner } = req.user;
    const contact = await Contact.findOne({ _id: id })
        .where("owner")
        .equals(owner);

    if (!contact) {
        throw HttpError(404);
    };

    res.status(200).json(contact);
};

const deleteContact = async (req, res) => {
    const { id } = req.params;
    const { _id: owner } = req.user;
    const deletedContacts = await Contact.findByIdAndDelete({ _id: id })
        .where("owner")
        .equals(owner);

    if (!deletedContacts) {
        throw HttpError(404);
    };

    res.status(204).json(deletedContacts);
};

const createContact = async (req, res) => {
    const { _id: owner } = req.user;
    const newContact = await Contact.create({ ...req.body, owner });

    res.status(201).json(newContact);
};

const updateContact = async (req, res) => {
    const { id } = req.params;
    const { _id: owner } = req.user;
    const updatedContact = await Contact.findByIdAndUpdate({ _id: id }, req.body, { new: true })
        .where("owner")
        .equals(owner);
    
    if (!updatedContact) {
        throw HttpError(404);
    };

    res.status(200).json(updatedContact);
};

const updateFavorite = async (req, res) => {
    const { id } = req.params;
    const { _id: owner } = req.user;
    const { favorite } = req.body;
    const updatedFavorite = await Contact.findByIdAndUpdate(
        { _id: id },
        { favorite },
        { new: true }
    )
        .where("owner")
        .equals(owner);

    if (!updatedFavorite) {
        throw HttpError(404);
    };

    res.status(200).json(updateFavorite);
};

module.exports = {
    getAllContacts,
    getOneContact,
    deleteContact,
    createContact,
    updateContact,
    updateFavorite,
};
