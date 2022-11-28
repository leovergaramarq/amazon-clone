import Category from '../models/Category.js';
import validCategory from '../utils/validCategory.js';

export async function readOne (req, res) {
    let category;
    try {
        category = await Category.findById(req.params.id);
    } catch (err) {
        if(err.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid category id' });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
    if (!category) return res.status(404).json({ message: 'Category not found' });

    res.status(200).json(category);
}

export async function readMany (req, res) {
    let categorys;
    try {
        categorys = await Category.find();
        } catch (err) {
        return res.status(500).json({ message: 'Internal server error' });
    }

    res.status(200).json(categorys);
}

export async function createOne (req, res) {
    const { name } = req.body;
    if(!name || !validCategory(name)) {
        return res.status(400).json({ message: 'Please, fill all the fields' });
    }

    let category;
    try {
        category = await Category.create({ name });
    } catch (err) {
        if(err.name === 'ValidationError') {
            return res.status(400).json({ message: 'Invalid category' });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }

    res.status(201).json(category);
}

export async function updateOne (req, res) {
    const { name } = req.body;

    if(!name || !validCategory(name)) {
        return res.status(400).json({ message: 'Please, fill at least one field' });
    }

    try {
        await Category.updateOne({ _id: req.params.id }, { name }, { new: true });
    } catch (err) {
        if(err.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid category id' });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
    
    res.status(200).json({ fields: [ 'name' ] });
}

export async function deleteOne (req, res) {
    try {
        await Category.deleteOne({ _id: req.params.id });
    } catch (err) {
        if(err.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid category id' });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }

    res.status(200).json({ message: 'Category deleted successfully' });
}
