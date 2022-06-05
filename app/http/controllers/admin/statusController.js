const Order = require('../../../models/order');

exports.postOrderStatus = async (req, res) => {
    const { orderId, status } = req.body;
    try{
        await Order.updateOne({ _id: orderId }, {status: status})
        return res.redirect('/admin/orders')
    } catch(err) {
        console.log(err)
        return res.redirect('/admin/orders')
    }
};