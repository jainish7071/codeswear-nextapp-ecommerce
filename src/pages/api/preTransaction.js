import Order from '../../models/Order';
import connectDb from "../../middleware/mongoose"

const https = require('https');
const PaytmChecksum = require('paytmchecksum');

const handler = async (req, res) => {
    if (req.method === "POST") {

        // Check if the cart is tampered with --- [Pending]

        // Check if the cart items are out of stock ----[Pending]

        // Check if the details Are valid ----[Pending]

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
                        resolve(JSON.parse(response).body)
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