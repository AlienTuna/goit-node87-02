const express = require('express')
const {
  listContactsController,
  getContactByIdController,
  removeContactController,
  addContactController,
  updateContactController,
  updateStatusContactController,
} = require('../../controllers/contactsController');
const router = express.Router()

router.get('/', listContactsController)

router.get('/:contactId', getContactByIdController)

router.post('/', addContactController)

router.delete('/:contactId', removeContactController)

router.put('/:contactId', updateContactController)

router.patch('/:contactId/favorite', updateStatusContactController)

module.exports = router
