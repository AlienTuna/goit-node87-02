const { HttpError } = require('../utils');
const Contact = require('./contactsModel');

const listContacts = async (req) => await Contact.find({ owner: req.user.id });

const getContactById = async (contactId, ownerId) => await Contact.findOne({_id: contactId, owner: ownerId });

const removeContact = async (contactId, ownerId) => await Contact.findOneAndDelete({_id: contactId, owner: ownerId });

const addContact = (newContact, owner) => {
  const {name, email, phone } = newContact;

  return Contact.create({
    name,
    email,
    phone,
    owner,
  });
}

const updateStatusContact = async (contactId, ownerId, body) => {
  try {return await Contact.findOneAndUpdate({ _id: contactId, owner: ownerId }, body, {new: true})}
  catch (error) { throw new HttpError(404, 'Not found!');}
};

const updateContact = async (contactId, ownerId, body) => await Contact.findByIdAndUpdate({_id: contactId, owner: ownerId }, body, {new: true});

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
}
