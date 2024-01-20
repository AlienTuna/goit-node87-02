// const fs = require('fs/promises');
// const { randomUUID } = require('crypto');
// const path = require('path');
// const { HttpError } = require('../utils');
const { HttpError } = require('../utils');
const Contact = require('./contactsModel');

// const contactsPath = path.resolve('models', 'contacts.json');

// const updateContactsFile = (data) => {
//   fs.writeFile(contactsPath, JSON.stringify(data))
// }

const listContacts = async () => await Contact.find();

const getContactById = async (contactId) => await Contact.findById(contactId);

const removeContact = async (contactId) => await Contact.findByIdAndDelete(contactId);

const addContact = async (newContact) => await Contact.create(newContact);

const updateStatusContact = async (contactId, body) => {
  try {
    const res = await Contact.findByIdAndUpdate(contactId, body, {new: true});
    return res;
  } catch (error) {
    throw new HttpError(404, 'Not found!');
  }
  

};

const updateContact = async (contactId, body) => await Contact.findByIdAndUpdate(contactId, body, {new: true});

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
}
