const User = require('../../models/user');
const bcrypt = require("bcrypt");
const passport = require('passport');

exports.getLogin = (req, res) => {
    res.render('auth/login');
};

exports.getRegister = (req, res) => {
    res.render('auth/register');
};

exports.postLogin = (req, res, next) => {
    const {email, password } = req.body;

    // Validate request
    if (!email || !password) {
        req.flash('error', 'Kindly fill all the boxes 🍕')
        req.flash('email', email)
        return res.redirect('./login')
    }

    passport.authenticate('local', (err, user, info) => {
        if (err) {
            req.flash('error', info.message)
            return next(err)
        }

        if (!user) {
            req.flash('error', info.message)
            return res.redirect('/login')
        }

        req.logIn(user, (err) => {
            if (err) {
                req.flash('error', info.message)
                return next(err)
            }
            
            if(req.user.role === 'admin') {
                return res.redirect('/admin/orders')
            }else{
                return res.redirect('/customer/orders')
            }
        })
    })(req, res, next)
}

exports.postRegister = async (req, res) => {
    const { name, email, password } = req.body;

    // Validate request
    if (!name || !email || !password) {
        req.flash('error', 'Kindly fill all the boxes 🍕')
        req.flash('name', name)
        req.flash('email', email)
        return res.redirect('./register')
    }

    // check existing user
    User.exists({ email: email }, (err, result) => {
        if (result) {
            req.flash('error', 'Email already taken 😮')
            req.flash('name', name)
            req.flash('email', email)
            return res.redirect('./register')
        }
    })

    // Hash password
    let hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
        name: name,
        email: email,
        password: hashedPassword,
    })

    user.save().then((user) => {
        return res.redirect('/')
    }).catch(err => {
        req.flash('error', 'Something went wrong 🥶')
        return res.redirect('./register')
    })
}

exports.postLogout = (req, res, next) => {
    req.logout((err) => {
        if(err) return next(err);
        res.redirect('./login');
    });
}