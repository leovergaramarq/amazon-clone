import { Schema, model } from 'mongoose';

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        default: 0
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
