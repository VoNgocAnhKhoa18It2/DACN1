const db = require('mongoose');
const Point = db.model('points', {
    module: { type: db.Types.ObjectId, ref: "modules" },
    student: { type: db.Types.ObjectId, ref: "students" },
    cc: String,
    bt: String,
    gk: String,
    ck: String,
    t10: String,
    letter: String,
});

module.exports = Point;