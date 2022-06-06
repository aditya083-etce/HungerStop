const Menu = require('../../models/menu');

exports.gethome = async (req, res) => {
    const pizzas  = await Menu.find({});
    // res.send(pizzas);
    res.render('home', { pizzas: pizzas });
}

exports.gotoOrders = (req, res) => {
    if(req.user.role === 'admin'){
        return res.redirect("/admin/orders");
    }
    return res.redirect("/customer/orders");
}