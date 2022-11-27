import { Schema, model } from 'mongoose';

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    seller: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reviews: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }]
    }
}, { versionKey: false });

export default model('Product', productSchema);
