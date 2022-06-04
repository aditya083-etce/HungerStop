const express = require('express')
const app = express();
const path = require('path')
const bodyParser = require("body-parser");
var favicon = require('serve-favicon');
const expressLayout = require('express-ejs-layouts')
const webRoutes = require("./routes/web");
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require("connect-mongodb-session")(session);
require('dotenv').config();
const flash = require('express-flash');
const passport = require('passport');

const PORT = process.env.PORT || 3300;
const MONGODB_URI = "mongodb://localhost:27017/pizzaTime";
const store = new MongoDBStore({uri: MONGODB_URI, collection: 'sessions'})

// Session
app.use(session({
    secret: process.env.COOKIE_SECRET, 
    resave: false, 
    saveUninitialized: false,
    cookie: { maxAge: 1000*60*60*24 }, // 24 hours
    store: store 
}));

// Passport config
const passportInit = require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())

// Global middleware
app.use((req, res, next) => {
    res.locals.session = req.session;
    res.locals.user = req.user;
    next();
})

// Assets
app.use(flash())
app.use(expressLayout) // only for ejs <%- body %> syntax
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname,'public','favicon.ico')));

app.set('views', path.join(__dirname, 'resources/views'));
app.use(express.json())
app.use(bodyParser.urlencoded({extended: false}));
app.set("view engine", "ejs");

// Routes
app.use(webRoutes);

// Server connection
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

// Database connection
mongoose.connect(MONGODB_URI, () => {
    console.log("connected to db");
});

// (async () => {
//     try{
//         await mongoose.connect(MONGODB_URI, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//             useCreateIndex: true
//         }, () => {
//             console.log('connected to database...');
//         });
//     } catch(err) {
//         console.log({err: err});
//     }
// }) ();