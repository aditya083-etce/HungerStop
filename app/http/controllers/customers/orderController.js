const Order = require('../../../models/order');
const moment = require('moment');

exports.postOrders = async (req, res) => {
    const { phone, address} = req.body;

    // Validate request
    if (!phone || !address){
        req.flash('error', 'Pizza cannot locate you 😞')
        return res.redirect('./cart')
    }

    const order = new Order({
        customer_id: req.user._id,
        items: req.session.cart.items,
        phone: phone,
        address: address,
    })

    order.save().then(async (result) => {
        try{
            let placedOrder = await Order.populate(result, { path: 'customer_id'})
            req.flash('success', 'YaaaHUUUuu !!... Arriving at your doorstep shortly 🔥')
            delete req.session.cart

            // Emit event
            const eventEmitter = req.app.get('eventEmitter');
            eventEmitter.emit('orderPlaced', placedOrder)

            return res.redirect('/customer/orders')
        }catch(err) {
            res.status(500).send({ err: "Server error" });
            console.log(err)
        }
    }).catch(err => {
        req.flash('error', 'Something went wrong 🥶')
        return res.redirect('./cart')
    })
};

exports.getOrders = async (req, res) => {
    const orders = await Order.find({
        customer_id: req.user._id,
        status: { $ne: 'completed' }
    }, null, { sort : { 'createdAt' : -1}});
    res.header('Cache-Control', 'no-store')
    res.render('customers/orders', {orders: orders, moment: moment});
};

exports.getOrderStatus = async (req, res) => {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);

    // Authorise user
    if (req.user._id.toString() === order.customer_id.toString()){
        return res.render('customers/status', {order: order});
    }
    return res.redirect("/");
}