import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Review from '../models/Review.js';
import filterFields from '../utils/filterFields.js';
import validCategory from '../utils/validCategory.js';
import Category from '../models/Category.js';

const { ObjectId } = mongoose.Types;

export async function readOne (req, res) {
    let product;
    try {
        product = await Product.findById(req.params.id)
            .populate('user', '_id username')
            .populate('category', '_id name');
    } catch (err) {
        if(err.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid product id' });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.status(200).json(product);
}

export async function readMany (req, res) {
    let products;
    try {
        products = await Product.find(req.query)
            .populate('user', '_id username')
            .populate('category', '_id name');
        } catch (err) {
        return res.status(500).json({ message: 'Internal server error' });
    }

    res.status(200).json(products);
}

export async function createOne (req, res) {
    const { name, description, price, stock, category: cat } = req.body;
    if(!name || !description || !price || !stock || !cat) {
        return res.status(400).json({ message: 'Please, fill all the fields' });
    }
    
    let category;
    try {
        category = (ObjectId.isValid(cat) ?
            await Category.findById(cat) :
            await Category.findOne({ name: cat }))._id;
    } catch (err) {}
    if(!category) {
        if(validCategory(cat)) {
            try {
                category = (await Category.create({ name: cat }))._id;
            } catch (err) {
                console.log(err);
                if(err.name === 'ValidationError') {
                    return res.status(400).json({ message: 'Category already exists' });
                }
                return res.status(500).json({ message: 'Internal server error' });
            }
        } else {
            return res.status(400).json({ message: 'Invalid category' });
        }
    }
    
    let product;
    try {
        product = await Product.create(filterFields({
            name, description, price, stock, category,
            user: req.token.id,
        }));
    } catch (err) {
        if(err.name === 'ValidationError') {
            return res.status(400).json({ message: 'Product already exists' });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }

    res.status(201).json(product);
}

export async function updateOne (req, res) {
    const { name, description, price, stock, category: cat } = req.body;

    if(!name && !description && !price && !stock && !cat) {
        return res.status(400).json({ message: 'Please, fill at least one field' });
    }
    
    let category;
    if(cat) {
        try {
            category = (await Category.findById(cat))._id;
        } catch (err) {
            return res.status(500).json({ message: 'Internal server error' });
        }
        if(!category) {
            if(validCategory(cat)) {
                try {
                    category = (await Category.create({ name: cat }))._id;
                } catch (err) {
                    if(err.name === 'ValidationError') {
                        return res.status(400).json({ message: 'Category already exists' });
                    }
                    return res.status(500).json({ message: 'Internal server error' });
                }
            } else {
                return res.status(400).json({ message: 'Invalid category' });
            }
        }
    }

    const fields = filterFields({ name, description, price, stock, category });

    try {
        await Product.updateOne({ _id: req.params.id }, fields, { new: true });
    } catch (err) {
        if(err.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid product id' });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
    
    res.status(200).json({ fields: Object.keys(fields) });
}

export async function deleteOne (req, res) {
    try {
        await Product.deleteOne({ _id: req.params.id });
    } catch (err) {
        if(err.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid product id' });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
}

//  REVIEWS

export async function readReview (req, res) {
    let review;
    try {
        review = await Review.findOne({ product: req.params.id, _id: req.params.reviewId })
            .populate('user', '_id username');
    } catch (err) {
        if(err.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid product or review id' });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
    if (!review) return res.status(404).json({ message: 'Review not found' });

    res.status(200).json(review);
}

export async function readReviews (req, res) {
    let reviews;
    try {
        reviews = await Review.find({ product: req.params.id })
            .populate('user', '_id username');
    } catch (err) {
        if(err.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid product id' });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }

    res.status(200).json(reviews);
}
