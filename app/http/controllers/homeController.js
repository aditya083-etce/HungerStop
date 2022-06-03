const Menu = require('../../models/menu');

exports.gethome = async (req, res) => {
    const pizzas  = await Menu.find({});
    // res.send(pizzas);
    res.render('home', { pizzas: pizzas });
}