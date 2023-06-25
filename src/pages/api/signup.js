import connectDb from "../../middleware/mongoose";
import User from "../../models/User"
import CryptoJS from "crypto-js";

const handler = async (req, res) => {
    if (req.method === 'POST') {
        const { name, email } = req.body;
        let u = new User({ name, email, password: CryptoJS.AES.encrypt(req.body.password, process.env.CRYPTO_AES_SECRET).toString() });
        try {
            await u.save();
            res.status(200).json({ success: true })
        } catch (e) {
            res.status(200).json({ error: e.message })
        }
    } else {
        res.status(400).json({ error: "This method is not allowed" })
    }
}

export default connectDb(handler); 