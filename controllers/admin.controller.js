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

module.exports = {

    index: async (req, res) => {
        res.render('page/index', {
            title: "Home | Admin",
            status: res.locals.status
        });
    },
    
    lop: async (req, res) => {
        const lop = await Class.find()

        res.render('page/lop', {
            title: 'Lop',
            user: res.locals.user,
            status: res.locals.status,
            classes: lop,
        })
    },

    addClass: async (req, res) => {
        const lop = req.body;

        const add = await new Class(lop).save()
        
        if(add) {
            req.session.status = 'Thêm Lớp Thành Công'
        } else {
            req.session.status = 'Thêm Lớp Thất Bại'
        }

        res.redirect("/admin/class");
    },

    editClass: async (req, res) => {
        const classUpdate = {
            idClass: req.body.idClass,
            nameClass: req.body.nameClass,
        }
        const id = req.body.edit

        const update = await Class.updateOne({ _id: id },classUpdate);
        if (update.ok == 1) {
            req.session.status = "Sửa Thành Công"
        } else {
            req.session.status = "Sửa Thất Bại."
        }
        res.redirect("/admin/class");
    },

    deleteClass: async (req, res) => {
        const id = req.params.id;
        const doc = await Class.deleteOne({ _id: id });
        if (doc.ok == 1) {
            res.send(true);
        } else {
            res.send(false);
        }
    },

    getStudentsForClass: async (req, res) => {
        const idClass = req.params.idClass;
        const students = await Student.find({ classActivity: { $ne: idClass} })
        res.send(students)
    },

    setStudentForClass: async (req, res) => {
        const find = JSON.parse(req.body.students);
        const classActivity = req.body.classActivity;
        const addModules = await Student.updateMany({ _id: { $in: find } }, {
            classActivity: classActivity
        });
        if (addModules.nModified == find.length) {
            req.session.status = "Thêm Thành Công"
            res.send(true);
        } else {
            req.session.status = "Thêm Thất Bại"
            res.send(false);
        }

    },

    classStudent: async (req, res) => {
        const students = await Student.find({ classActivity: req.params.lop })
        const classes = await Class.findOne({ idClass: req.params.lop})
        res.render('page/listStudentClass', {
            title: req.params.lop,
            status: res.locals.status,
            user: res.locals.user,
            students: students,
            classes: classes,
        })
    },

    classStudentDelete: async (req, res) => {
        const find = {
            _id : req.body._id
        }
        const update = {
            classActivity: ""
        }
        const doc = await Student.updateOne(find, update)
        if (doc.ok == 1) {
            res.send(true);
        } else {
            res.send(false);
        }
    },

    student: async (req, res) => {
        const students = await Student.find()
        const classes = await Class.find()
        res.render('page/student', {
            title: 'Student',
            status: res.locals.status,
            user: res.locals.user,
            students: students,
            classes: classes,
        })
    },

    addStudent: async (req, res) => {
        const add =  req.body;
        if (req.files != null) {
            let img = req.files.image
            const err = await img.mv("./public/img/avatar/" + req.body._id+img.name.slice(-4))
            if (err) return err
            add.avatar = req.body._id+img.name.slice(-4)
        }
        add.password = "123456"

        await new Student(add).save()
        req.session.status = "Thêm Thành Công"
        res.redirect("/admin/student");
        
    },

    updateStudent: async (req, res) => {
        const find = {
            _id : req.body._id
        }
        const update = req.body
        if (req.files != null) {
            let img = req.files.image
            const err = await img.mv("./public/img/avatar/" + req.body._id+img.name.slice(-4))
            if (err) return err
            update.avatar = req.body._id+img.name.slice(-4)
        }

        const checkUser = await Student.find({email: req.body.email});
        
        if (checkUser.length <= 1) {
            delete update._id;
            
            let doc = await Student.updateOne(find, update);
            if (doc.ok == 1) {
                req.session.status = "Sửa Thành Công"
            } else {
                req.session.status = "Sửa Thất Bại."
            }
		} else {
            req.session.status = "Thêm Thất Bại. Email tồn tại"
		}
        res.redirect("/admin/student");
    },

    deleteStudent: async (req, res) => {
        const _id = req.params.id;
        await Point.deleteMany( { student: _id } )
        const doc = await Student.deleteOne({ _id: _id });
        if (doc.ok == 1) {
            res.send(true);
        } else {
            res.send(false);
        }
    },

    teacher: async (req, res) => {
        const teachers = await Teacher.find()

        res.render('page/teacher', {
            title: 'Teacher',
            status: res.locals.status,
            user: res.locals.user,
            teachers: teachers,
        })
    },

    addTeacher: async (req, res) => {
        const add = req.body;
        add.password = "123456"
        await new Teacher(add).save()
        req.session.status = "Thêm Thành Công"
        res.redirect("/admin/teacher");
    },

    updateTeacher: async(req, res) => {
        const find = {
            _id : req.body._id
        }

        const update = {
            idTeacher: req.body.idTeacher,
            name: req.body.name,
            gender: req.body.gender,
            phoneNumber: req.body.phoneNumber,
            email: req.body.email,
            password: req.body.password,
        }

        const checkUser = await Teacher.find({email: req.body.email});
        
        if (checkUser.length <= 1) {
            let doc = await Teacher.updateOne(find, update);
            if (doc.ok == 1) {
                req.session.status = "Sửa Thành Công"
            } else {
                req.session.status = "Sửa Thất Bại."
            }
		} else {
            req.session.status = "Thêm Thất Bại. Email tồn tại"
		}

        res.redirect("/admin/teacher");
    },

    deleteTeacher: async (req, res) => {
        const _id = req.params.id;
        const doc = await Teacher.deleteOne({ _id: _id });
        if (doc.ok == 1) {
            res.send(true);
        } else {
            res.send(false);
        }
    },

    subject: async (req, res) => {
        const subjects = await Subject.find()

        res.render('page/subject', {
            title: 'Subject',
            status: res.locals.status,
            user: res.locals.user,
            subjects: subjects,
        })
    },
    
    addSubject: async (req, res) => {
        const add = req.body;
        await new Subject(add).save()
        req.session.status = "Thêm Thành Công"
        res.redirect("/admin/subject");
    },

    updateSubject: async (req, res) => {
        const find = {
            _id : req.body._id
        }
        const update = req.body;
        let doc = await Subject.updateOne(find, update);
        if (doc.ok == 1) {
            req.session.status = "Sửa Thành Công"
        } else {
            req.session.status = "Sửa Thất Bại."
        }
        res.redirect("/admin/subject");
    },

    deleteSubject: async (req, res) => {
        const _id = req.params.id;
        const doc = await Subject.deleteOne({ _id: _id });
        if (doc.ok == 1) {
            res.send(true);
        } else {
            res.send(false);
        }
    },

    modules: async (req, res) => {
        const classStudies = await Module.find()
        const subjects = await Subject.find()
        
        res.render('page/modules', {
            title: 'Modules',
            status: res.locals.status,
            user: res.locals.user,
            classStudies: classStudies,
            subjects: subjects,
        })
    },

    addModules: async (req, res) => {
        const add = req.body

        const check = await Module.find({idModule: req.body.idModule})

        if (check.length == 0) {
            add.status = 'active';
            await new Module(add).save()
            req.session.status = "Thêm Thành Công"
        } else {
            req.session.status = "Thêm Thất Bại. Mã Lớp Học Phần Tồn Tại."
        }
        
        res.redirect("/admin/modules");
    },

    updateModules: async (req, res) => {
        const find = {
            _id : req.body._id
        }
        const update = req.body;
        let doc = await Module.updateOne(find, update);
        if (doc.ok == 1) {
            req.session.status = "Sửa Thành Công"
        } else {
            req.session.status = "Sửa Thất Bại."
        }
        res.redirect("/admin/modules");
    },

    deleteModules: async (req, res) => {
        const _id = req.params.id;
        const check = await Module.findById(_id)
        if (check) {
            await Calendar.deleteMany({ _id: { $in: check.calendars } })
            await Student.updateMany({ modules: _id },{
                $pull: {
                    modules: _id
                }
            })
            await Point.deleteMany( { module: _id} )
        }
        const doc = await Module.deleteOne({ _id: _id });

        if (doc.ok == 1) {
            res.send(true);
        } else {
            res.send(false);
        }
    },

    calendar: async (req, res) => {
        const listDate = [
            ['T2', 'Thứ Hai'],
            ['T3', 'Thứ Ba'],
            ['T4', 'Thứ Tư'],
            ['T5', 'Thứ Năm'],
            ['T6', 'Thứ Sáu'],
            ['T7', 'Thứ Bảy'],
            ['CN', 'Chủ Nhật']
        ];
        const calendars = await Module.find( {$nor: [{calendars: {$exists: false}}, {calendars: {$size: 0}}]} ).sort({ nameModule: 1 })
            .populate({ 
                path: 'calendars',
                populate: { 
                    path: 'teacher',
                    select: 'name _id'
                },
                options: { sort:{ description: 1 }}
                 
            })
        const subjects = await Subject.find()
        const teachers = await Teacher.find()
        const modules = await Module.find()
        
        // res.send(calendars)
        res.render('page/calendar', {
            title: 'Calendar',
            status: res.locals.status,
            user: res.locals.user,
            calendars: calendars,
            subjects: subjects,
            listDate: listDate,
            teachers: teachers,
            modules: modules,
        })
    },

    addCalendar: async (req, res) => {
        const calendar = {
            dayOfWeek: req.body.dayOfWeek,
            classroom: req.body.classroom,
            lesson: req.body.bat_dau + "->" + req.body.ket_thuc,
            description: req.body.description,
            dateStart: req.body.dateStart,
            dateEnd: req.body.dateEnd,
            teacher: req.body.teacher,
            module: req.body.module,
        };

        const add = await new Calendar(calendar).save();

        const addCalendar = await Module.updateOne({ _id: req.body.module}, {
            $addToSet: {
                calendars: add._id
            }
        })
        req.session.status = "Thêm Thành Công"
        res.redirect("/admin/calendar");
    },

    updateCalendar: async (req, res) => {
        const find = {
            _id: req.body._id
        }
        const calendar = {
            dayOfWeek: req.body.dayOfWeek,
            classroom: req.body.classroom,
            lesson: req.body.bat_dau + "->" + req.body.ket_thuc,
            description: req.body.description,
            dateStart: req.body.dateStart,
            dateEnd: req.body.dateEnd,
            teacher: req.body.teacher
        };

        let doc = await Calendar.updateOne(find, calendar);
        if (doc.ok == 1) {
            req.session.status = "Sửa Thành Công"
        } else {
            req.session.status = "Sửa Thất Bại."
        }
        res.redirect("/admin/calendar");
    },

    deleteCalendar: async (req, res) => {
        const _id = req.params.id;
        await Module.updateOne({ calendars: _id },{
            $pull: {
                calendars: _id
            }
        })
        const doc = await Calendar.deleteOne({ _id: _id });
        if (doc.ok == 1) {
            req.session.status = "Xóa Thành Công"
            res.send(true);
        } else {
            res.send(false);
        }
    },

    moduleDetail: async (req, res) => {
        const idModule = req.params.class
        const module = await Module.findOne({ idModule: idModule })
        const students = await Student.find({ modules: module._id })
        const title = 'Module | ' + toTitleCase(module.nameModule," ")
        res.render('page/listStudentModules', {
            title: title,
            status: res.locals.status,
            user: res.locals.user,
            students: students,
            module: module,
        })
    },

    getStudents: async (req, res) => {
        const _id = req.params.subject;
        const modules = await Module.find({ subject: _id }, { _id: 1 });
        const students = await Student.find({ modules: { $nin: modules } })
        res.send(students)
    },

    setStudent: async (req, res) => {
        const find = JSON.parse(req.body.students);
        const _id = req.body._id;
        const addModules = await Student.updateMany({ _id: { $in: find } }, {
            $addToSet: { 
                modules: _id
            }
        });
        if (addModules.nModified == find.length) {
            let points = [];
            for (let i = 0 ; i < find.length ; i++) {
                const point = {
                    module: _id,
                    student: find[i],
                    cc: '0',
                    bt: '0',
                    gk: '0',
                    ck: '0',
                    t10: '0',
                    letter:""
                }
                points.push(point);
            }
            Point.insertMany(points).then(function(){
                req.session.status = "Thêm Thành Công"
                res.send(true);
            }).catch(function(err){
                req.session.status = "Thêm Thất Bại"
                res.send(false);
            });
        } else {
            req.session.status = "Thêm Thất Bại"
            res.send(false);
        }
    },

    removeStudent: async (req, res) => {
        const find = {
            _id: req.body._id
        }
        const update = req.body.module

        const deleteModule = await Student.updateOne(find, {
            $pull: {
                modules: update
            }
        })
        if(deleteModule.ok == 1) {
            const deletePoint = await Point.deleteOne( { student: req.body._id } )
            if (deletePoint.ok == 1) {
                res.send(true);
            } else {
                res.send(false);
            }
        } else {
            res.send(false);
        }
    },
}