import { Schema, model } from 'mongoose';

const purchaseSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: {
        type: [{
            product: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            }
        }],
    },
    total: {
        type: Number,
        required: true,
        default: 0
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { versionKey: false });

export default model('Purchase', purchaseSchema);
