import mongoose from 'mongoose';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Purchase from '../models/Purchase.js';

export async function readOne(req, res) {
    let purchase;
    try {
        purchase = await Purchase.findById(req.params.id)
            .populate('user', '_id username')
            .populate('products.product', '_id name price');
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid purchase id' });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
    if (!purchase) return res.status(404).json({ message: 'Purchase not found' });

    res.status(200).json(purchase);
}

export async function readMany(req, res) {
    let purchases;
    try {
        purchases = await Purchase.find(req.query)
            .populate('user', '_id username')
            .populate('products.product', '_id name price');
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error' });
    }

    res.status(200).json(purchases);
}

export async function createOne(req, res) {
    let cart;
    try {
        cart = await Cart.findOne({ user: req.token.id });
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid user id' });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const { products } = cart;

    let purchase;

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        try {
            for (let i = 0; i < products.length; i++) {
                const product = await Product.findByIdAndUpdate(
                    products[i].product,
                    { $inc: { stock: -products[i].quantity } },
                    { session, new: true }
                );
                if(product.stock < 0) throw new Error(`Not enough stock for ${product.name} (${product.stock} available)`);
            }
        } catch (err) {
            console.log(err);
            await session.abortTransaction();
            session.endSession();

            if(err.message.includes('Not enough stock')) {
                return res.status(400).json({ message: err.message });
            }
            
            return res.status(500).json({ message: 'Internal server error' });
        }
        
        try {
            purchase = await Purchase.create([{
                products,
                user: req.token.id,
                total: await Purchase.calculateTotal(products)
            }], { session });
        } catch (err) {
            console.log(err);
            await session.abortTransaction();
            session.endSession();

            if (err.name === 'ValidationError') {
                return res.status(400).json({ message: 'Invalid purchase data' });
            }
            return res.status(500).json({ message: 'Internal server error' });
        }

        await session.commitTransaction();
        session.endSession();
    } catch (err) {
        console.log(err);
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({ message: 'Internal server error' });
    }

    try {
        await Cart.updateOne({ user: req.token.id }, { products: [] });
        // await Cart.deleteOne({ user: req.token.id });
    } catch (err) {
        console.log('Could not empty cart');
        console.log(err);
    }

    res.status(200).json(purchase);
}