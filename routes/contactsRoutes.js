const express = require('express')
const contactsRouter = express.Router()
const {
  listContactsController,
  getContactByIdController,
  removeContactController,
  addContactController,
  updateContactController,
  updateStatusContactController,
} = require('../controllers/contactsController');
const { authMiddleware } = require('../middlewares');

contactsRouter.use(authMiddleware.checkTokenMW);

contactsRouter.get('/', listContactsController)

contactsRouter.get('/:contactId', getContactByIdController)

contactsRouter.post('/', addContactController)

contactsRouter.delete('/:contactId', removeContactController)

contactsRouter.put('/:contactId', updateContactController)

contactsRouter.patch('/:contactId/favorite', updateStatusContactController)

module.exports = contactsRouter;
