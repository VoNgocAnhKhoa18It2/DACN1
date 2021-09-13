const Teacher = require('../models/teacher.model')
const Student = require('../models/student.model')
const Class = require('../models/class.model')
const Module = require('../models/module.model')
const Point = require('../models/point.model')
const Subject = require('../models/subject.model')
const Calendar = require('../models/calendar.model')

module.exports = {
    login: async (req, res) => {
        const data = {
            successful: false,
            messages: '',
        }
        const user = await Student.findOne({email: req.body.email},{ modules: 0})
        if (!user) {
            data.messages = 'Email Hoặc Mật Khẩu Không Đúng'
            return res.json(data)
        }

        if (user.password != req.body.password) {
            data.messages = 'Mật Khẩu Không Đúng'
            return res.json(data)
        }

        data.successful = true
        data.messages = 'Đăng Nhập Thành Công'
        data.data = user
        res.json(data)
    },

    calendarToday: async (req, res) => {
        var now = new Date();
        var thu = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
        const data = {
            successful: false,
        }
        
        try {
            const module = await Student.findOne({ _id: req.params._id.toString() }, { modules: 1, _id: 0 })
            const find = {
                $and: [
                    { 
                        module: { $in: module.modules },
                        dayOfWeek: thu[now.getDay() - 1]
                    },
                    {$nor: [
                        { dateStart: { $gt: new Date()}}, 
                        { dateEnd: { $lt: new Date(),}}
                    ]},
                ]
            }
            const calendar = await Calendar.find(find,{ dateEnd: 0, dateStart:0 }).sort({ "lesson": 1 })
                .populate({path: 'module',select: '_id nameModule',populate: { path: 'subject' }}).populate('teacher')
            data.successful = true
            data.data = calendar
            res.json(data)
        } catch (error) {
            data.messages = error.message
            return res.json(data)
        }
    },

    calendar: async (req, res) => {
        const data = {
            successful: false,
        }
        try {
            const module = await Student.findOne({ _id: req.params._id.toString() }, { modules: 1, _id: 0 })
            const calendar = await Module.find({ _id: { $in: module.modules } })
                .populate({
                    path: 'calendars',
                    match: {
                        $nor: [
                            { dateStart: { $gt: new Date()}}, 
                            { dateEnd: { $lt: new Date(),}}
                        ]
                    },
                    populate: { path: 'teacher' }
                })
            data.successful = true
            data.data = calendar
            res.json(data)
        } catch (error) {
            data.messages = error.message
            return res.json(data)
        }
    },

    updateSV: async (req, res) => {
        const data = {
            successful: false,
        }
        const user = {
            name: req.body.name,
            birth: req.body.birth,
            gender: req.body.gender,
            phoneNumber: req.body.phoneNumber,
            address: req.body.address,
        }
        try {
            const doc = await Student.updateOne({_id: req.body._id.toString()}, user);
            if (doc.nModified == 1) {
                data.successful = true
                data.messages = "Sửa Thành Công"
            } else {
                data.messages = "Sửa Thất Bại."
            }
            return res.json(data)
        } catch (err) {
            data.messages = err.message
            return res.json(data)
        }
    },

    editPassword: async(req, res) => {
        const data = {
            successful: false,
        }
        const email = req.body.email;
        const passOld = req.body.passOld;
        const passNew = req.body.passNew;

        try {
            const student = await Student.findOne({ email:  email })
    
            if (student.password == passOld) {
                const doc = await Student.updateOne({ email:  email },{ password:passNew });
                if (doc.nModified == 1) {
                    data.successful = true
                    data.messages = "Sửa Thành Công"
                } else {
                    data.messages = "Sửa Thất Bại."
                }
            } else {
                data.messages = "Sửa Thất Bại. Mật Khẩu Không Đúng" 
            }
            return res.json(data)
        } catch (error) {
            data.messages = error.message
            return res.json(data)
        }
    },

    showPoint: async (req, res) => {
        const data = {
            successful: false,
        }

        try {
            const point = await Point.find({ student: req.params._id.toString() })
                .populate({
                    path: 'module',
                    populate: { path: 'subject' },
                    select: 'subject'
                })
            data.successful = true
            data.data = point
            return res.json(data)
        } catch (error) {
            data.messages = error.message
            return res.json(data)
        }
    }
}
