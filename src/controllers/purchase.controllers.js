import Purchase from '../models/Purchase.js';

export async function readOne (req, res) {
    let purchase;
    try {
        purchase = await Purchase.findById(req.params.id)
            .populate('user', '_id username')
            .populate('products.product', '_id name price');
    } catch (err) {
        if(err.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid purchase id' });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
    if (!purchase) return res.status(404).json({ message: 'Purchase not found' });

    res.status(200).json(purchase);
}

export async function readMany (req, res) {
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
