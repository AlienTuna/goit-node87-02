// const { HttpError } = require('../utils');
const User = require('./userModel');

// const listContacts = async () => await User.find();

// const getContactById = async (contactId) => await User.findById(contactId);

// const removeContact = async (contactId) => await User.findByIdAndDelete(contactId);

const addNewUser = async (newUser) => await User.create(newUser);

// const updateStatusContact = async (contactId, body) => {
//     try { return await Contact.findByIdAndUpdate(contactId, body, { new: true }) }
//     catch (error) { throw new HttpError(404, 'Not found!'); }
// };

// const updateContact = async (contactId, body) => await Contact.findByIdAndUpdate(contactId, body, { new: true });

module.exports = {
    addNewUser,
}