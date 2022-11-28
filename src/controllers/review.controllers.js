import Review from '../models/Review.js';
import filterFields from '../utils/filterFields.js';

export async function readOne (req, res) {
    let review;
    try {
        review = await Review.findById(req.params.id)
            .populate('user', '_id username')
            .populate('product', '_id name');
    } catch (err) {
        if(err.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid review id' });
        }
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

    let review;
    try {
        review = await Review.create(filterFields({
            title, description, product, user: req.token.id
        }));
    } catch (err) {
        if(err.name === 'ValidationError') {
            return res.status(400).json({ message: 'Please, fill all the fields' });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }

    res.status(201).json(review);
}

export async function deleteOne (req, res) {
    try {
        await Review.deleteOne({ _id: req.params.id, user: req.token.id });
    } catch (err) {
        if(err.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid review id' });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }

    res.status(200).json({ message: 'Review deleted successfully' });
}
