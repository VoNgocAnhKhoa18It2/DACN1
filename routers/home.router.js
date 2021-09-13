const express = require('express');

const homeController = require("../controllers/home.controller");

const router = express.Router();

router.get("", homeController.index)
router.post('/edit-password', homeController.edit_password);
router.get('/calendar', homeController.calendar);
router.get('/point', homeController.point);
router.get('/point/:idModule', homeController.pointEdit);
router.post('/point/edit', homeController.editPoint);

module.exports = router;