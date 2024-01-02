const fs = require('fs/promises');
const { randomUUID } = require('crypto');
const path = require('path');
const { HttpError } = require('../utils');

const contactsPath = path.resolve('models', 'contacts.json');

const updateContactsFile = (data) => {
  fs.writeFile(contactsPath, JSON.stringify(data))
}

const listContacts = async () => {
  const result = await fs.readFile(contactsPath);
  return JSON.parse(result);
}

const getContactById = async (contactId) => {
  const contacts = await listContacts();
  const result = contacts.find(el => el.id === contactId);
  return result;
}

const removeContact = async (contactId) => {
  const contactsList = await listContacts();
  const indx = contactsList.findIndex(el => el.id === contactId);

  if (indx === -1) throw new HttpError(404, `Not found`)
  
  const result = contactsList.splice(indx, 1);
  await updateContactsFile(contactsList);
  return result;
}

const addContact = async (newContact) => {
  const contactsList = await listContacts();
  const newContactResult = {
    ...newContact,
    id: randomUUID(),
  };
  contactsList.push(newContactResult);
  await updateContactsFile(contactsList);
  return newContactResult;
}

const updateContact = async (contactId, body) => {
  const contactsList = await listContacts();
  const indx = contactsList.findIndex((el) => el.id === contactId);

  if (indx === -1) throw new HttpError(404, `Not found`)

  contactsList[indx] = { ...contactsList[indx], ...body };
  await updateContactsFile(contactsList);
  return contactsList[indx];
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
