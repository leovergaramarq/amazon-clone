import Review from '../models/Review.js';
import filterFields from '../utils/filterFields.js';

export async function readOne (req, res) {
    let review;
    try {
        review = await Review.findById(req.params.id)
            .populate('user', '_id username')
            .populate('product', '_id name');
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error' });
    }
    if (!review) return res.status(404).json({ message: 'Review not found' });

    res.status(200).json(review);
}

export async function readMany (req, res) {
    let reviews;
    try {
        reviews = await Review.find(req.query)
            .populate('user', '_id username')
            .populate('product', '_id name');
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error' });
    }

    res.status(200).json(reviews);
}

export async function createOne (req, res) {
    const { title, description, product } = req.body;
    const user = req.token.id;

    let review;
    try {
        review = await Review.create(filterFields({
            title, description, product, user
        }));
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error' });
    }

    res.status(201).json(review);
}

export async function updateOne (req, res) {
    const { title, description, rating } = req.body;

    if (!title && !description && !rating) {
        return res.status(400).json({ message: 'Please, fill at least one field' });
    }

    let fields = filterFields({ title, description, rating });

    try {
        await Review.findByIdAndUpdate(req.params.id, fields);
    } catch (err) {
        return res.status(400).json({ message: 'Review not found' });
    }

    res.status(200).json({ fields: Object.keys(fields) });
}

export async function deleteOne (req, res) {
    try {
        await Review.findByIdAndDelete(req.params.id);
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error' });
    }

    res.status(200).json({ message: 'Review deleted successfully' });
}
