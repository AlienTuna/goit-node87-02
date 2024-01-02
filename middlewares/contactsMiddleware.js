const fs = require('fs/promises');
const { catchAsync, HttpError } = require('../utils');


exports.checkContactId = catchAsync(async (req, res, next) => {
    const {id} = req.params;
    if(id.length < 10) throw new HttpError(400, 'Invalid ID');
    const contacts = await fs.readFile('contacts.json');
    const contactById = contacts.find(el => el.id ===id);

    if(!contactById) throw new HttpError(400, 'Contact not found!');
})