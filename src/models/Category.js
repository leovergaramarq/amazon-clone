import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
}, { versionKey: false });

export default model('Category', categorySchema);
