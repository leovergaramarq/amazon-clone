import mongoose from 'mongoose';
import Product from './Product.js';

const { Schema, model } = mongoose;

const cartSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
        index: true
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
        }]
    },
    total: {
        type: Number,
        required: true,
        default: 0
    }
}, { versionKey: false });

cartSchema.statics.calculateTotal = async function (products) {
    return products.reduce(async (total, { product, quantity }) => {
        const { price } = await Product.findById(product);
        return total + price * quantity;
    }, 0);
    
    // let total = 0;
    // for (let i = 0; i < products.length; i++) {
    //     const product = products[i];
    //     const { price } = await this.model('Product').findById(product.product);
    //     total += price * product.quantity;
    // }
    // return total;
}

export default model('Cart', cartSchema);
