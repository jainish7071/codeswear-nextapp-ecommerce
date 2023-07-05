import Order from '../../models/Order';
import connectDb from "../../middleware/mongoose"
import jsonwebtoken from 'jsonwebtoken';

const handler = async (req, res) => {
    const token = req.body.token;
    const user = jsonwebtoken.verify(token, process.env.JWT_SECRET);
    let orders = await Order.find({ email: user.email, status: "Paid" });
    res.status(200).json({ orders });
}
export default connectDb(handler);