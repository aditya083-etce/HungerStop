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
const flash = require('express-flash');
const passport = require('passport');
const Emitter = require('events')
require('dotenv').config();

const PORT = process.env.PORT || 3300;
const MONGODB_URI = process.env.DATABASE_CONNECTION;
const store = new MongoDBStore({uri: MONGODB_URI, collection: 'sessions'})

// Event emitter
const eventEmitter = new Emitter()
app.set('eventEmitter', eventEmitter)

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

// goto error page on random url
app.use((req, res)=> {
    res.status(404).render('error');
})

// Server connection
const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

// Database connection
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Database connected...');
})

// Socket
const io = require('socket.io')(server)
io.on('connection', (socket) => {
    // Join 
    socket.on('join', (roomId) => {
        console.log(roomId);
        socket.join(roomId)
    })
}) // ^--- this is the basic setup

// socket event emmiter for order status update -- done on admin side and changes seen on customer side
eventEmitter.on('orderUpdated', (data) => {
    io.to(`order_${data.id}`).emit('orderUpdated', data)
})

// socket event emmiter for order placed -- done on customer side and changes seen on admin side
eventEmitter.on('orderPlaced', (placedOrder) => {
    io.to(`adminRoom`).emit('orderPlaced', placedOrder)
})

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