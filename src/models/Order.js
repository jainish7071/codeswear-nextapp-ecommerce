const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    email: { type: String, required: true },
    orderId: { type: String, required: true },
    paymentInfo: { type: String, default: '' },
    products: { type: Object, required: true },
    address: { type: String, required: true },
    transactionId: { type: String, default: "" },
    amount: { type: Number, required: true },
    status: { type: String, default: 'Initiated', required: true },
    deliveryStatus: { type: String, default: 'UnShipped', required: true },
}, { timestamps: true })

export default mongoose.models.order || mongoose.model("order", OrderSchema);