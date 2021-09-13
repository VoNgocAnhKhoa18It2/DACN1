module.exports = {

    checkUser: (req, res, next) => {
        if (!req.signedCookies.user) {
            console.log(req.path)
            res.redirect("/login")
        } 
        res.locals.user = req.signedCookies.user;
        next();
    },

    checkAdmin: (req, res, next) => {
        if (req.signedCookies.user != 'admin') {
            req.session.status = "Vui Lòng Đăng Nhập Với Tài Khoản Admin"
            res.redirect("/login")
        }
        next()
    },

    checkSession:(req, res, next) => {
        if(req.session.status) {
            res.locals.status = req.session.status;
            req.session.status = undefined;
        }

        next();
    },
}