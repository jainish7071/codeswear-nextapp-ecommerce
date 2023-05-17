import mongoose from 'mongoose';

const connectDb = handler => async (req, res) => {
    if (mongoose.connections[0].readyState) {
        return handler(req, res);
    }
    await mongoose.connect(process.env.MONGO_URI, {
        family: 4 // Use IPv4, skip trying IPv6
    });
    return handler(req, res);
}

export default connectDb;