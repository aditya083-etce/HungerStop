const express = require('express')
const app = express();
const path = require('path')
const bodyParser = require("body-parser");
var favicon = require('serve-favicon');
const expressLayout = require('express-ejs-layouts')

// Assets
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname,'public','favicon.ico')));

app.use(expressLayout)
app.set('views', path.join(__dirname, 'resources/views'));
app.use(bodyParser.urlencoded({extended: false}));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render('home');
});

app.get("/cart", (req, res) => {
    res.render('customers/cart');
});

app.get("/register", (req, res) => {
    res.render('auth/register');
});

app.get("/login", (req, res) => {
    res.render('auth/login');
});

const PORT = process.env.PORT || 3300;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
