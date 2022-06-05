const Order = require('../../../models/order');

exports.getAdminOrders = async (req, res) => {
    try {
        const orders = await Order.find({ status: { $ne: 'completed' } }, null, { sort: { 'createdAt': -1 }}).populate('customer_id', '-password');
        if(req.xhr) {
            return res.json(orders)
        } else {
            return res.render('admin/orders')
        }
    } catch(err) {
        res.status(500).send({ err: "Server error" });
        console.log(err)
    }
};