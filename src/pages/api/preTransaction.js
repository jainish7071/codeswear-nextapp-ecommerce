import Order from '../../models/Order';
import connectDb from "../../middleware/mongoose"
import Product from '../../models/Product';
import pincodes from "../../../pincodes.json";

const https = require('https');
const PaytmChecksum = require('paytmchecksum');

const handler = async (req, res) => {
    if (req.method === "POST") {

        // check if the pin-code is serviceable
        if (!Object.keys(pincodes).includes(req.body.pincode)) {
            return res.status(200).json({ "success": false, "error": "The pincode you have entered is not serviceable.", cartClear: false })
        }

        // Check if the cart is tampered with
        let sumTotal = 0;
        const cart = req.body.cart;
        if (req.body.subTotal <= 0) {
            return res.status(200).json({ "success": false, "error": "Your Cart is Empty! Please build your cart and try again.", cartClear: false })
        }
        for (let item in cart) {
            let product = await Product.findOne({ slug: item })
            sumTotal += product.price * cart[item].qty;
            // Check if the cart items are out of stock
            if (product.availableQty < cart[item].qty) {
                return res.status(200).json({ "success": false, "error": "Some items in your cart went our of stock. Please try later!", cartClear: true })
            }
            if (product.price !== cart[item].price) {
                return res.status(200).json({ "success": false, "error": "The price of some items in your cart have changed. Please try again", cartClear: true })
            }
        }
        if (sumTotal != req.body.subTotal) {
            return res.status(200).json({ success: false, "error": "The price of some items in your cart have changed. Please try again", cartClear: true })
        }


        // Check if the details Are valid
        if (req.body.phone.length != 10 || !Number.isInteger(Number(req.body.phone))) {
            return res.status(200).json({ success: false, "error": "Please Enter your 10-digit Phone number", cartClear: false })
        }
        if (req.body.pincode.length != 6 || !Number.isInteger(Number(req.body.pincode))) {
            return res.status(200).json({ success: false, "error": "Please Enter your 6-digit Pin-code", cartClear: false })
        }

        // Initiate an order corresponding to this order id
        let order = new Order({
            email: req.body.email,
            orderId: req.body.orderId,
            address: req.body.address,
            amount: req.body.subTotal,
            products: req.body.cart
        })
        await order.save();
        let paytmParams = {};

        paytmParams.body = {
            "requestType": "Payment",
            "mid": process.env.NEXT_PUBLIC_PAYTM_MID,
            "websiteName": "YOUR_WEBSITE_NAME",
            "orderId": req.body.orderId,
            "callbackUrl": `${process.env.NEXT_PUBLIC_HOST}/api/postTransaction`,
            "txnAmount": {
                "value": req.body.subTotal,
                "currency": "INR",
            },
            "userInfo": {
                "custId": req.body.email,
            },
        };

        /*
        * Generate checksum by parameters we have in body
        * Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
        */
        const checkSum = await PaytmChecksum.generateSignature(JSON.stringify(paytmParams.body), process.env.PAYTM_MKEY);
        paytmParams.head = {
            "signature": checkSum
        };

        var post_data = JSON.stringify(paytmParams);

        const requestAsync = () => {
            return new Promise((resolve, reject) => {
                var options = {

                    /* for Staging */
                    // hostname: 'securegw-stage.paytm.in',

                    /* for Production */
                    hostname: 'securegw.paytm.in',

                    port: 443,
                    path: `theia/api/v1/initiateTransaction?mid=${process.env.NEXT_PUBLIC_PAYTM_MID}&orderId=${req.body.orderId}`,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': post_data.length
                    }
                };
                var response = "";
                var post_req = https.request(options, function (post_res) {
                    post_res.on('data', function (chunk) {
                        response += chunk;
                    });

                    post_res.on('end', function () {
                        let ress = JSON.parse(response).body;
                        ress.success = true;
                        ress.cartClear = false;
                        resolve(ress);
                    });
                });

                post_req.write(post_data);
                post_req.end();
            })
        }

        let myR = await requestAsync();
        res.status(200).json(myR);
    }
}
export default connectDb(handler);