const fs = require("fs").promises;
const path = require("path");
const crypto = require("crypto");

const contactsPath = path.join(__dirname, "db", "contacts.json");

async function listContacts() {
    const data = await fs.readFile(contactsPath, "utf8");
    return JSON.parse(data);
};

async function getContactById(contactId) {
    const array = await listContacts();

    if (array.length === 0) {
        return null;
    };

    const contacts = array.find(contact => contact.id === contactId);

    return contacts || null;
};

async function removeContact(contactId) {
    const array = await listContacts();
    
    if (array.length === 0) {
        return null;
    };

    const contacts = array.find(contact => contact.id === contactId);

    if (contacts === undefined) {
        return null;
    };

    const newArray = array.filter(contact => contact.id !== contactId);

    fs.writeFile(contactsPath, JSON.stringify(newArray, null, 2), "utf8");

    return contacts;
}

async function addContact(name, email, phone) {
    const array = await listContacts();
    let contacts = array.find(contact => contact.email === email || name.email === name);

    if (contacts !== undefined) {
        throw new Error("CONTACT_EXISTS");
    };
    
    contacts = { id: crypto.randomUUID(), name, email, phone };
    array.push(contacts);

    fs.writeFile(contactsPath, JSON.stringify(array, null, 2), "utf8");
    
    return contacts;
};

async function updateContact(contactId, body) {
    const array = await listContacts();
    const contactsIndex = array.findIndex(contact => contact.id === contactId);
    
    if (contactsIndex === -1) {
        return null;
    };

    const updatedContact = { ...array[contactsIndex], ...body };
    array[contactsIndex] = updatedContact;

    await fs.writeFile(contactsPath, JSON.stringify(array, null, 2), "utf8");

    return updatedContact;
};

module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact,
    updateContact,
};
