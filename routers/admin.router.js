const express = require('express');
const adminController = require('../controllers/admin.controller.js');

const router = express.Router();
router.get('/', adminController.index);

router.get('/class', adminController.lop);
router.post('/class/add', adminController.addClass);
router.post('/class/edit', adminController.editClass);
router.get('/class/delete/:id', adminController.deleteClass);

router.get('/class/:lop', adminController.classStudent);
router.get('/class/student/:idClass', adminController.getStudentsForClass);
router.post('/class/student/delete', adminController.classStudentDelete);
router.post('/class/addStudent', adminController.setStudentForClass);

router.get('/student', adminController.student);
router.post('/student/add', adminController.addStudent);
router.post('/student/update', adminController.updateStudent);
router.get('/student/delete/:id', adminController.deleteStudent);

router.get('/teacher', adminController.teacher);
router.post('/teacher/add', adminController.addTeacher);
router.post('/teacher/update', adminController.updateTeacher);
router.get('/teacher/delete/:id', adminController.deleteTeacher);

router.get('/subject', adminController.subject);
router.post('/subject/add', adminController.addSubject);
router.post('/subject/update', adminController.updateSubject);
router.get('/subject/delete/:id', adminController.deleteSubject);

router.get('/modules', adminController.modules);
router.post('/modules/add', adminController.addModules);
router.post('/modules/update', adminController.updateModules);
router.get('/modules/delete/:id', adminController.deleteModules);

router.get('/calendar', adminController.calendar);
router.post('/calendar/add', adminController.addCalendar);
router.post('/calendar/edit', adminController.updateCalendar);
router.get('/calendar/delete/:id', adminController.deleteCalendar);

router.get('/modules/:class', adminController.moduleDetail);
router.get('/modules/student/:subject', adminController.getStudents);
router.post('/modules/addStudent', adminController.setStudent);
router.post('/modules/student/delete/', adminController.removeStudent);

module.exports = router;