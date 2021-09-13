const db = require('mongoose');
const Class = db.model('classes', {
    idClass: String,
    nameClass: String,
});

module.exports = Class;