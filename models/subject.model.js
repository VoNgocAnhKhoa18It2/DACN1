const db = require('mongoose');
const Subject = db.model('subjects', {
    idSubject: String,
    nameSubject: String,
});

module.exports = Subject;