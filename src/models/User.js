import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email:  {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        // length: 60
    },
    location: {
        type: String
    }
}, { versionKey: false });

export default model('User', userSchema);
