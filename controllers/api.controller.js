const Teacher = require('../models/teacher.model')
const Student = require('../models/student.model')
const Class = require('../models/class.model')
const Module = require('../models/module.model')
const Point = require('../models/point.model')
const Subject = require('../models/subject.model')
const Calendar = require('../models/calendar.model')

const toTitleCase = (phrase,step) => { 
    return phrase.toLowerCase().split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(step);
}

const addMinutes =  function (dt, minutes) {
    const date = new Date(dt.getTime() + minutes*60000);
    const hours = `0${date.getHours()}`.slice(-2);
    const minute = `0${date.getMinutes()}`.slice(-2);
    const result = {
        start : date,
        time : `${hours}:${minute}`
    }
    return result
}

const setTime = (lesson) => {
    var lesson = lesson.split("->") 
    let date = new Date();
    if (lesson[0] <= 5) {
        date.setHours(7,30,00)
    } else {
        lesson[0] = lesson[0] - 5
        lesson[1] = lesson[1] - 5
        date.setHours(13,00,00)
    }
    const start = ((lesson[0]-1) == 0) ? 0 : (lesson[0]-1)*60
    const timeStart = addMinutes(date,start)
    const end = (lesson[1] - lesson[0] + 1)*60 - 10
    const timeEnd = addMinutes(timeStart.start,end)
    return `${timeStart.time}->${ timeEnd.time }`
}

module.exports = {
    login: async (req, res) => {
        const data = {
            successful: false,
            messages: '',
        }
        try {
            let user = await Student.findOne({email: req.body.email})
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
        } catch (err) {
            data.messages = error.message
            return res.json(data)
        }
    },

    calendarToday: async (req, res) => {
        var now = new Date();
        const thu = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN','thu[now.getDay() - 1]'];
        const data = {
            successful: false,
        }   
        
        try {
            const module = await Student.findOne({ _id: req.params._id.toString() }, { modules: 1, _id: 0 })
            const find = {
                $and: [
                    { 
                        module: { $in: module.modules },
                        dayOfWeek: 'T3'
                    },
                    {$nor: [
                        { dateStart: { $gt: new Date()}}, 
                        { dateEnd: { $lt: new Date(),}}
                    ]},
                ]
            }
            const calendars = await Calendar.find(find,{ dateEnd: 0, dateStart:0 }).sort({ "lesson": 1 })
                .populate({path: 'module',select: '_id nameModule'})

            calendars.map(calendar => {
                calendar.module.nameModule = toTitleCase(calendar.module.nameModule," ")
                calendar.lesson= setTime(calendar.lesson)
            })
            data.successful = true
            data.data = calendars
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
            const find = {
                $and: [
                    { 
                        module: { $in: module.modules },
                    },
                    {$nor: [
                        { dateStart: { $gt: new Date()}}, 
                        { dateEnd: { $lt: new Date(),}}
                    ]},
                ]
            }
            const calendars = await Calendar.find(find,{ dateEnd: 0, dateStart:0 })
                .populate({path: 'module',select: '_id nameModule'}).populate('teacher')

            calendars.map(calendar => {
                calendar.module.nameModule = toTitleCase(calendar.module.nameModule," ")
                calendar.lesson= setTime(calendar.lesson) + " | " + calendar.dayOfWeek
            })   
            data.successful = true
            data.data = calendars
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
            
            if (req.files != null) {
                let img = req.files.avatar
                const err = await img.mv("./public/img/avatar/" + req.body._id+img.name.slice(-4))
                if (err) return err
                user.avatar = req.body._id+img.name.slice(-4)
            }
            const doc = await Student.findOneAndUpdate({_id: req.body._id.toString()}, user,{
                new: true,
                upsert: true,
                rawResult: true
              });
            if (doc.lastErrorObject.updatedExisting) {
                data.successful = true
                data.messages = "Sửa Thành Công"
                data.data = doc.value
            } else {
                data.messages = "Sửa Thất Bại"
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
            let points = await Point.find({ student: req.params._id.toString() })
                .populate({
                    path: 'module',
                    populate: { path: 'subject' },
                    select: 'subject'
                })
            const p = []
            points.map(point => {
                const a = {
                    name: toTitleCase(point.module.subject.nameSubject," "),
                    ...point._doc,
                }
                p.push(a)
            })   
            data.successful = true
            data.data = p
            return res.json(data)
        } catch (error) {
            data.messages = error.message
            return res.json(data)
        }
    },

    calendarToWeek: async (req, res) => {
        const data = {
            successful: false,
        }
        try {
            const module = await Student.findOne({ _id: req.params._id.toString() }, { modules: 1, _id: 0 })
            const calendars = await Module.find({ _id: { $in: module.modules } })
                .populate({
                    path: 'calendars',
                    match: {
                        $nor: [
                            { dateStart: { $gt: new Date()}}, 
                            { dateEnd: { $lt: new Date(),}}
                        ]
                    },
                    select: 'dayOfWeek classroom lesson description teacher',
                    populate: { 
                        path: 'teacher',
                        select: 'name', 
                    }
                })

                calendars.map(module => {
                    module.nameModule = toTitleCase(module.nameModule," ")
                    module.calendars.map(calendars => calendars.lesson = setTime(calendars.lesson))
                })
            data.successful = true
            data.data = calendars
            res.json(data)
        } catch (error) {
            data.messages = error.message
            return res.json(data)
        }
    },
}
