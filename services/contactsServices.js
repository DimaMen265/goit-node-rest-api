const { Contact } = require("../schemas/mongoSchema");

async function listContacts() {
    try {
        const contacts = await Contact.find()
        return contacts;
    } catch (error) {
        console.log(`Error: ${error}`);
    };
};

async function getContactById(id) {
    try {
        const contact = await Contact.findById(id);
        return contact || null;
    } catch (error) {
        console.log(`Error: ${error}`);
        return null;
    };
};

async function deleteContact(id) {
    try {
        const deletedContact = await Contact.findByIdAndDelete(id);
        return deletedContact || null;
    } catch (error) {
        console.log(`Error removing contact: ${error}`);
        return null;
    };
};

async function addContact(name, email, phone) {
    try {
        const newContact = await Contact.create({ name, email, phone });
        return newContact;
    } catch (error) {
        console.log(`Error adding contact: ${error}`);
        return null;
    };
};

async function updateContact(id, name, email, phone) {
    try {
        const updatedContact = await Contact.findById(id);

        if (!updatedContact) {
            return null;
        };

        updatedContact.name = name || updatedContact.name;
        updatedContact.email = email || updatedContact.email;
        updatedContact.phone = phone || updatedContact.phone;

        await updatedContact.save();

        return updatedContact;
    } catch (error) {
        console.log(`Error updating contact: ${error}`);
        return null;
    };
};

async function updateStatus(id, favorite) {
    try {
        const updatedStatus = await Contact.findByIdAndDelete(
            id,
            { favorite },
            { new: true }
        );
        return updatedStatus;
    } catch (error) {
        console.log(`Error updating contact status: ${error}`);
        return null;
    }
}

module.exports = {
    listContacts,
    getContactById,
    deleteContact,
    addContact,
    updateContact,
    updateStatus,
};
