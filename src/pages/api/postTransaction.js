import Order from '../../models/Order';
import connectDb from "../../middleware/mongoose"
import Product from '../../models/Product';
import PaytmChecksum from 'paytmchecksum';

const handler = async (req, res) => {
    // Validate Paytm CheckSum -- Pending
    let paytmchecksum = "";
    let paytmParams = {}
    const recieved_data = req.body;
    for (let key in recieved_data) {
        if (key === "CHECKSUMHASH") {
            paytmchecksum = recieved_data;
        } else {
            paytmParams[key] = recieved_data[key];
        }
    }
    let isValidCheckSum = PaytmChecksum.verifySignature(paytmParams, process.env.PAYTM_MKEY, paytmchecksum);
    if (!isValidCheckSum) {
        return res.status(500).json({ success: false, error: "Some Error Occurred" });
    }
    // update status Orders table after checking the transaction status -- Pending
    let order;
    switch (req.body.STATUS) {
        case "TXN_SUCCESS":
            order = await Order.findOneAndUpdate({ orderId: req.body.ORDERID }, { status: "Paid", paymentInfo: JSON.stringify(req.body), transactionId: req.body.TXNID });
            let products = order.products;
            for (let slug in products) {
                await Product.findOneAndUpdate({ slug: slug }, { $inc: { availableQty: - products[slug].qty } })
            }
            break;
        case "PENDING":
            order = await Order.findOneAndUpdate({ orderId: req.body.ORDERID }, { status: "Pending", paymentInfo: JSON.stringify(req.body), transactionId: req.body.TXNID });
            break;
        case "TXN_FAILURE":
            order = await Order.findOneAndUpdate({ orderId: req.body.ORDERID }, { status: "Failed", paymentInfo: JSON.stringify(req.body), transactionId: req.body.TXNID });
            break;
        default:
            return res.status(200).json({ error: "Something went wrong!" })
    }
    // Initiate Shipping --- Pending
    // Redirect user to the order confirmation page --- Pending
    res.redirect("/order?clearCart=true&id=" + order._id, 200);
    res.status(200).json({ body: req.body })
}
export default connectDb(handler);