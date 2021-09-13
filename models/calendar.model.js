const db = require('mongoose');
const Calendar = db.model('calendars', {
    dayOfWeek: String,
    classroom: String,
    lesson: String,
    description: String,
    dateStart: Date,
    dateEnd: Date,
    teacher: { type: db.Types.ObjectId, ref: "teachers" },
    module: { type: db.Types.ObjectId, ref: "modules" },
});

module.exports = Calendar;