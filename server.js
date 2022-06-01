const express = require('express')
const app = express()
const ejs = require('ejs')
const path = require('path')
const expressLayout = require('express-ejs-layouts')

// app.use(expressLayout)
app.set('views', path.join(__dirname, 'resources/views'))
app.set('view engine', 'ejs')

app.get("/", (req, res) => {
    res.render('home');
})

const PORT = process.env.PORT || 3300;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
