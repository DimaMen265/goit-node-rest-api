const { Contact } = require("../models/contact");
const HttpError = require("../helpers/HttpError");

const getAllContacts = async (req, res) => {
    try {
        const { _id: owner } = req.user;
        const { page = 1, limit = 20 } = req.query;
        const skip = (page - 1) * limit;
        const contacts = await Contact.find({ owner }, "", {
            skip,
            limit: Number(limit),
        }).populate("owner", "name", "email");

        res.status(200).json(contacts);
    } catch (error) {
        if (error.status) {
            res.status(error.status).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal Server Error" });
        };
    };
};

const getOneContact = async (req, res) => {
    try {
        const { id } = req.params;
        const { _id: owner } = req.user;
        const contact = await Contact.findOne({ _id: id })
            .where("owner")
            .equals(owner);

        if (!contact) {
            throw HttpError(404);
        };

        res.status(200).json(contact);
    } catch (error) {
        if (error.status) {
            res.status(error.status).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal Server Error" });
        };
    };
};

const deleteContact = async (req, res) => {
    try {
        const { id } = req.params;
        const { _id: owner } = req.user;
        const deletedContacts = await Contact.findByIdAndDelete({ _id: id })
            .where("owner")
            .equals(owner);

        if (!deletedContacts) {
            throw HttpError(404);
        };

        res.status(204).json(deletedContacts);
    } catch (error) {
        if (error.status) {
            res.status(error.status).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal Server Error" });
        };
    }
};

const createContact = async (req, res) => {
    try {
        const { _id: owner } = req.user;
        const newContact = await Contact.create({ ...req.body, owner });

        res.status(201).json(newContact);
    } catch (error) {
        if (error.status) {
            res.status(error.status).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal Server Error" });
        };
    };
};

const updateContact = async (req, res) => {
    try {
        const { id } = req.params;
        const { _id: owner } = req.user;
        const updatedContact = await Contact.findByIdAndUpdate({ _id: id }, req.body, { new: true })
            .where("owner")
            .equals(owner);
    
        if (!updatedContact) {
            throw HttpError(404);
        };

        res.status(200).json(updatedContact);
    } catch (error) {
        if (error.status) {
            res.status(error.status).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal Server Error" });
        };
    };
};

const updateFavorite = async (req, res) => {
    try {
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
    } catch (error) {
        if (error.status) {
            res.status(error.status).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal Server Error" });
        };
    };
};

module.exports = {
    getAllContacts,
    getOneContact,
    deleteContact,
    createContact,
    updateContact,
    updateFavorite,
};
