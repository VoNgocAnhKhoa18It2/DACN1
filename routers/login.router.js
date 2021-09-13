const express = require('express');

const login = require("../controllers/login.controller");

const router = express.Router();

router.get("/", login.index)
router.post("/", login.loginPost)
router.get("/logout", login.logout)

module.exports = router;