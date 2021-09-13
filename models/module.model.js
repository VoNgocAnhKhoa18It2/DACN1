const db = require('mongoose');
const Module = db.model('modules', {
    idModule: String,
    nameModule: String,
    subject: { type: db.Types.ObjectId, ref: "subjects" },
    status: String,
    calendars: [ { type: db.Types.ObjectId, ref: "calendars" } ],
});

module.exports = Module;