import Order from '../../models/Order';
import connectDb from "../../middleware/mongoose"

const handler = async (req, res) => {
    // Validate Paytm CheckSum -- Pending
    // update status Orders table after checking the transaction status -- Pending
    let order;
    switch (req.body.STATUS) {
        case "TXN_SUCCESS":
            order = await Order.findOneAndUpdate({ orderId: req.body.ORDERID }, { status: "Paid", paymentInfo: JSON.stringify(req.body) });
            break;
        case "PENDING":
            order = await Order.findOneAndUpdate({ orderId: req.body.ORDERID }, { status: "Pending", paymentInfo: JSON.stringify(req.body) });
            break;
        case "TXN_FAILURE":
            order = await Order.findOneAndUpdate({ orderId: req.body.ORDERID }, { status: "Failed", paymentInfo: JSON.stringify(req.body) });
            break;
        default:
            res.status(200).json({ error: "Something went wrong!" })
    }
    // Initiate Shipping --- Pending
    // Redirect user to the order confirmation page --- Pending
    res.redirect("/order?id=" + order._id, 200);
    res.status(200).json({ body: req.body })
}
export default connectDb(handler);