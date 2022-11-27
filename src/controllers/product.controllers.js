import Product from '../models/Product.js';
import filterFields from '../utils/filterFields.js';

export async function readOne (req, res) {
    let product;
    try {
        product = await Product.findById(req.params.id)
            .populate('seller', '_id username')
            .populate('reviews', '_id rating title');
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error' });
    }
    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.status(200).json(product);
}

export async function readMany (req, res) {
    let products;
    try {
        products = await Product.find(req.query)
            .populate('seller', '_id username')
            .populate('reviews', '_id rating title');
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error' });
    }

    res.status(200).json(products);
}

export async function createOne (req, res) {
    const { name, description, price, stock } = req.body;
    if(!name || !description || !price || !stock) {
        return res.status(400).json({ message: 'Please, fill all the fields' });
    }
    
    const seller = req.token.id;

    let product;
    try {
        product = await Product.create(filterFields({
            name, description, price, stock, seller
        }));
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error' });
    }

    res.status(201).json(product);
}

export async function updateOne (req, res) {
    const { name, description, price, stock } = req.body;

    if(!name && !description && !price && !stock) {
        return res.status(400).json({ message: 'Please, fill at least one field' });
    }

    const fields = filterFields({ name, description, price, stock });

    try {
        await Product.findByIdAndUpdate(req.params.id, fields, { new: true });
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error' });
    }
    
    res.status(200).json({ fields: Object.keys(fields) });
}

export async function deleteOne (req, res) {
    try {
        await Product.findByIdAndDelete(req.params.id);
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
}
