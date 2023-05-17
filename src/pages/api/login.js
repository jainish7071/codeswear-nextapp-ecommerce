import connectDb from "../../middleware/mongoose";
import User from "../../models/User"
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken"

const handler = async (req, res) => {
    if (req.method === 'POST') {
        let user = await User.findOne({ email: req.body.email })
        const bytes = CryptoJS.AES.decrypt(user.password, "mySecretKey");
        console.log(bytes.toString(CryptoJS.enc.Utf8));
        const decryptedPass = bytes.toString(CryptoJS.enc.Utf8);
        if (user) {
            if (req.body.email === user.email && req.body.password === decryptedPass) {
                var token = jwt.sign({ email: user.email, name: user.name }, 'jwtSecret', { expiresIn: "2d" });
                res.status(200).json({ success: true, token })
            } else {
                res.status(401).json({ success: false, error: "Invalid Credentials" })
            }
        } else {
            res.status(404).json({ success: false, error: "No User found!" })
        }
    } else {
        res.status(400).json({ error: "This method is not allowed" })
    }
}

export default connectDb(handler); 