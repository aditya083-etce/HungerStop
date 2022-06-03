
exports.getLogin = (req, res) => {
    res.render('auth/login');
};

exports.getRegister = (req, res) => {
    res.render('auth/register');
};