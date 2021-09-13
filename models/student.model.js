const db = require('mongoose');
const Student= db.model('students', {
	idStudent: String, 
    name: String,
    gender: String,
    birth: Date,
	email: String, 
	phoneNumber: String,
    address: String,
    classActivity: String,
    course: String,
    avatar: String,
    password: String,
    modules: [{ type: db.Types.ObjectId, ref: "modules" }],
});

module.exports = Student;