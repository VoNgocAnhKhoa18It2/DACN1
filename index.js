const express = require('express')
const bodyParser = require('body-parser')
const expressLayouts = require('express-ejs-layouts');
const morgan = require('morgan')
const cookieParser = require('cookie-parser');
const session = require('express-session');
const fileUpload = require('express-fileupload');

const LoginRouter = require('./routers/login.router')
const AdminRouter = require('./routers/admin.router')
const HomeRouter = require('./routers/home.router')
const ApiRouter = require('./routers/api.router')

const middleware = require('./middleware/authentication')

const mongoose = require('mongoose');
require('dotenv').config();

const app = express()
var http = require('http').createServer(app);
// var io = require('./socket.io/socket.io.js')(http);

app.use(cookieParser("mySecretKey"))
app.use(session({
	secret: 'mySecretKey',
}));

const port = process.env.PORT || 3000;
app.set("view engine", "ejs");
app.use(middleware.checkSession)

app.use(morgan("dev"))
app.use("/assets", express.static(__dirname + "/public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload())
 
app.use(expressLayouts);

app.use("/api/v4", ApiRouter);
app.use("/login",LoginRouter);
app.use("/",middleware.checkUser ,HomeRouter);
app.use("/admin", middleware.checkAdmin,AdminRouter);


http.listen(port, () => console.log(`App listening at http://localhost:${port}`));



mongoose.connect(process.env.DB_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	.then(() => console.log("Connect DB Success"))
	.catch((err) => console.error(err));

