import mongoose from 'mongoose';

const appSchema = mongoose.Schema({
    message: String,
    name: String,
    timestamp: String,
    received: Boolean,
});



export default mongoose.model('messagecontents', appSchema)