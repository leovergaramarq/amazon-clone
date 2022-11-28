import mongoose from 'mongoose';
import Product from './Product.js';

const { Schema, model } = mongoose;

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

purchaseSchema.statics.calculateTotal = async function (products) {
    let productsFound;
    try {
        productsFound = await Product.find({ _id: { $in: products.map(p => p.product) } }, '_id price');
    } catch (err) {
        throw new Error('Internal server error');
    }
    if(!productsFound?.length || productsFound.length !== products.length) {
        return null;
    }

    return products.reduce((total, product) => {
        const productFound = productsFound.find(p => p._id.toString() === product.product.toString());
        if(!productFound) return total; // This should never happen, but just in case
        return total + productFound.price * product.quantity;
    }, 0);
}

export default model('Purchase', purchaseSchema);
