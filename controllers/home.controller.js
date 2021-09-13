const Teacher = require('../models/teacher.model')
const Student = require('../models/student.model')
const Class = require('../models/class.model')
const Module = require('../models/module.model')
const Point = require('../models/point.model')
const Subject = require('../models/subject.model')
const Calendar = require('../models/calendar.model')

const dates = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

var dateNames = [
    'Chủ Nhật',
    'Thứ Hai',
    'Thứ Ba',
    'Thứ Tư',   
    'Thứ Năm',
    'Thứ Sáu',
    'Thứ Bảy',
];

module.exports = {

    index: async (req, res) => {
        const thu = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
        const calendars = await Calendar.find({ teacher: res.locals.user._id }).populate('module');
        let list = [[[],[]],[[],[]],[[],[]],[[],[]],[[],[]],[[],[]],[[],[]]];
        calendars.forEach((calendar, index) => {
            var i = thu.indexOf(calendar.dayOfWeek);
            if (calendar.lesson.substring(0,1) <= 5 ) {
                list[i][0].push(calendar);
            } else {
                calendar.lesson = `${calendar.lesson.substring(0,1)-5}->${calendar.lesson.substring(3,calendar.lesson.length)-5}`;
                list[i][1].push(calendar);
            }
        })
        res.render("pageTeacher/index", {
            title: "Home",
            status: res.locals.status,
            user: res.locals.user.name,
            calendars: list,
        });
    },
    edit_password : async (req, res) => {
        const pass_old = req.body.pass_old;
        const pass_new = req.body.pass_new;

        const teacher = await Teacher.findOne({ 
            _id:  res.locals.user._id,
            password:pass_old
        })

        if (teacher) {
            const update = await Teacher.updateOne({ _id: res.locals.user._id },{ password:pass_new });
            if (update.ok == 1) {
                req.session.status = "Sửa Thành Công"
            } else {
                req.session.status = "Sửa Thất Bại."
            }
        } else {
            req.session.status = "Sửa Thất Bại. Mật Khẩu Không Đúng" 
        }

        res.redirect(req.body.path);
    },

    calendar: async (req, res) => {
        const thu = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
        const calendars = await Calendar.find({ teacher: res.locals.user._id }).populate('module');
        let list = [[[],[]],[[],[]],[[],[]],[[],[]],[[],[]],[[],[]],[[],[]]];
        calendars.forEach((calendar, index) => {
            var i = thu.indexOf(calendar.dayOfWeek);
            if (calendar.lesson.substring(0,1) <= 5 ) {
                list[i][0].push(calendar);
            } else {
                calendar.lesson = `${calendar.lesson.substring(0,1)-5}->${calendar.lesson.substring(3,calendar.lesson.length)-5}`;
                list[i][1].push(calendar);
            }
        })
        res.render("pageTeacher/calendar", {
            title: "Home",
            status: res.locals.status,
            user: res.locals.user.name,
            calendars: list,
        });
    },

    point: async (req, res) => {
        const calendars = await Calendar.find({ teacher: res.locals.user._id, description: 'LT' }).populate('module');
        res.render('pageTeacher/point',{
            title: "Nhập Điểm",
            status: res.locals.status,
            user: res.locals.user.name,
            calendars: calendars,
        })
    },

    pointEdit : async (req, res) => {
        const module = await Module.findOne({ idModule: req.params.idModule})
        const points = await Point.find({ module:module._id }).populate('student')
        res.render('pageTeacher/editPoint',{
            title: "Nhập Điểm",
            status: res.locals.status,
            user: res.locals.user.name,
            points: points,
            module:module,
        })
    },

    editPoint : async (req, res) => {
        var tb = 0
        if (req.body.bt == 0) {
            tb = 0.2*req.body.cc+0.2*req.body.gk+0.6*req.body.ck;
        } else {
            tb = 0.1*req.body.cc+0.2*req.body.bt+0.2*req.body.gk+0.5*req.body.ck;
        }
        var chu = "";
        switch (true) {
            case (tb < 4):
                chu = "F"
            break;
            case (tb >= 4) && (tb < 5.5):
                chu = "D"
            break;
            case (tb >= 5.5) && (tb < 7):
                chu = "C"
            break;
            case (tb >= 7) && (tb < 8.5):
                chu = "B"
            break;
            case (tb >= 8.5) && (tb < 10):
                chu = "A"
            break;
        }
        var diem_hp = {
            cc:req.body.cc,
            gk: req.body.gk,
            ck: req.body.ck,
            t10: (Math.round(tb * 1000)/1000).toFixed(1),
            letter: chu,
        }
        
        const update = await Point.updateOne({ _id: req.body._id },diem_hp)
        if (update.ok == 1) {
            req.session.status = "Sửa Thành Công"
        } else {
            req.session.status = "Sửa Thất Bại."
        }
        res.redirect(req.body.path);
    },
}