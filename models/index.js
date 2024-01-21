const Contact = require('./contactsModel');
const {
    listContacts,
    getContactById,
    removeContact,
    addContact,
    updateContact,
} = require('./contacts');

module.exports = {
    Contact,
    listContacts,
    getContactById,
    removeContact,
    addContact,
    updateContact,
};