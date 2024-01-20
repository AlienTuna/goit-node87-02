const { model, Schema} = require('mongoose');


const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    favorite: {
        type: Boolean,
        required: true,
        // default: false,
    }
})

const Contact = model('Contact', userSchema);

module.exports = Contact