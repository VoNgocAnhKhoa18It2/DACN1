const db = require('mongoose');
const Teacher= db.model('teachers', {
    idTeacher: String,
    name: String,
    gender: String,
	email: String, 
	phoneNumber: String,
    password: String
});

module.exports = Teacher;