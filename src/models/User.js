import mongoose from 'mongoose';
import { encryptPassword, comparePassword } from '../utils/bcrypt.js';

const { Schema, model } = mongoose;

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

userSchema.statics.encryptPassword = password => (
    encryptPassword(password)
);

userSchema.statics.comparePassword = function (password) {
    return comparePassword(password, this.password);
}

export default model('User', userSchema);
