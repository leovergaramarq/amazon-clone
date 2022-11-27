import Cart from '../models/Cart.js';
import filterFields from '../utils/filterFields.js';

export async function readOne (req, res) {
    let cart;
    try {
        cart = await Cart.findById(req.params.id)
            .populate('user', '_id username')
            .populate('products.product', '_id name price');
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error' });
    }
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    res.status(200).json(cart);
}

export async function readMany (req, res) {
    let carts;
    try {
        carts = await Cart.find(req.query)
            .populate('user', '_id username')
            .populate('products.product', '_id name price');
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error' });
    }

    res.status(200).json(carts);
}

export async function createOne (req, res) {
    let card;
    try {
        card = await Cart.create({ user: req.token.id });
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error' });
    }

    res.status(201).json({ id: card._id });
}

export async function updateOne (req, res) {
    const { products } = req.body;

    if (!products?.length) {
        return res.status(400).json({ message: 'Please, fill at least one field' });
    }

    let fields = { products };
    try {
        fields.total = await Cart.calculateTotal(products);
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error' });
    }
    
    try {
        await Cart.findByIdAndUpdate(req.params.id, fields);
    } catch (err) {
        return res.status(400).json({ message: 'Cart not found' });
    }

    res.status(201).json({ total: fields.total });
}
