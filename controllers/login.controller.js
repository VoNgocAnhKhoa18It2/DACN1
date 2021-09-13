const Teacher = require('../models/teacher.model')

module.exports = {

    index: (req, res) => {
        res.render('login/index', {
            title: 'Login',
            status: res.locals.status
        })
    },

    loginPost: async (req, res) => {
        const email = req.body.email;
        const password = req.body.password;

        if (email === "admin" && password === "123") {
            req.session.status = "Đăng Nhập Thành Công";
            res.cookie('user', email, {
                signed: true
            });
            res.redirect('/admin')
        } else {
            const teacher = await Teacher.findOne({ email: email, password: password });

            if (teacher) {
                req.session.status = "Đăng Nhập Thành Công"
                res.cookie('user', teacher, {
                    signed: true
                });
                res.redirect('/')
            } else {
                req.session.status = "Đăng Nhập Thất Bại"
                res.redirect('/login')
            }
        }
    },

    logout: (req, res) => {
        req.session.destroy();
        res.clearCookie("user");
        res.redirect("/")
    },
}