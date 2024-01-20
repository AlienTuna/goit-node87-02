// import * as contactsModels from "../models/contacts.js";
const {
    listContacts,
    getContactById,
    removeContact,
    addContact,
    updateContact,
    updateStatusContact,
} = require('../models/contacts.js');
// const Contact = require('../models/contactsModel.js');
// const catchAsync = require('../utils/catchAsync.js');
// const validator = require('../utils/validator.js');
// const HttpError = require('../utils/httpError.js');

const { catchAsync, contactValidators, HttpError } = require('../utils');


const listContactsController = catchAsync(async (req, res) => {
    const result = await listContacts();
    res.json(result);
})

const getContactByIdController = catchAsync(async (req, res) => {
    const { contactId } = req.params;
    const result = await getContactById(contactId);
    console.log(result)
    if (!result) {
        res.status(404).json({ message: `Not found` })
    }
    res.json(result);
})

const removeContactController = catchAsync(async (req, res) => {
    const { contactId } = req.params;
    const result = await removeContact(contactId);

    if (!result) throw new HttpError(404, `Not found`)

    res.json({ message: 'Contact removed' });
})

const addContactController = catchAsync(async (req, res) => {
    const { error } = contactValidators.addContactValidator(req.body);
    if (error) throw new HttpError(400, error)

    const result = await addContact(req.body);

    res.status(201).json(result);
})

const updateContactController = catchAsync(async (req, res) => {
    const { contactId } = req.params;
    const {name, phone, email, favorite} = req.body;

    const { error } = contactValidators.updateContactValidator(req.body);
    if (error) throw new HttpError(400, error)

    const result = await updateContact(contactId, {name, phone, email, favorite})

    if(!result) throw new HttpError(500, result)

    res.status(200).json(result);

})

const updateStatusContactController = catchAsync( async (req, res) => {
    const { contactId } = req.params;
    const {favorite} = req.body;

    if(favorite === undefined) throw new HttpError(400, 'missing field favorite');

    const result = await updateStatusContact(contactId, {favorite});
  
    if(!result) throw new HttpError(404, 'Not found');

    res.status(200).json(result);

})

module.exports = {
    listContactsController,
    getContactByIdController,
    removeContactController,
    addContactController,
    updateContactController,
    updateStatusContactController,
}