const express = require('express')
const {
  listContactsController,
  getContactByIdController,
  removeContactController,
  addContactController,
  updateContactController,
} = require('../../controllers/contactsController');
const router = express.Router()

router.get('/', listContactsController)

router.get('/:contactId', getContactByIdController)

router.post('/', addContactController)

router.delete('/:contactId', removeContactController)

router.put('/:contactId', updateContactController)

module.exports = router
