const express = require('express');

const api = require("../controllers/api.controller");

const router = express.Router();

router.post("/login", api.login)
router.get('/calendar/:_id',api.calendar)
router.get('/calendar/today/:_id',api.calendarToday)
router.get('/calendar-week/:_id',api.calendarToWeek)
router.post('/update/student',api.updateSV)
router.post('/update/password', api.editPassword);
router.get('/point/:_id',api.showPoint)
module.exports = router;