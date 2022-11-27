import User from '../models/User.js';

export async function readOne (req, res) {
    const { id } = req.params;
    let user;

    try {
        user = await User.findById(id, '-password');
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error' });
    }
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
}

export async function readMany (req, res) {
    let users;

    try {
        users = await User.find(req.query, '-password');
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error' });
    }

    res.status(200).json(users);
}

export async function createOne (req, res) {
    const { name, email, username, password, location } = req.body;
    if(!name || !email || !username || !password) {
        return res.status(400).json({ message: 'Please, fill all fields' });
    }
    
    let user;
    try {
        user = await User.create(filterFields({
            name, email, username, location,
            password: await User.encryptPassword(password)
        }));
    } catch (err) {
        return res.status(400).json({ message: 'Username or email already exists' });
    }

    res.status(201).json({ id: user._id });
}

export async function updateOne (req, res) {
    const { id } = req.params;
    const { name, email, username, password, location } = req.body;
    if(!name && !email && !username && !password) {
        return res.status(400).json({ message: 'Please, fill at least one field' });
    }

    const fields = filterFields({
        name, email, username, location,
        password: password ? User.encryptPassword(password) : undefined
    });
    
    try {
        await User.findByIdAndUpdate(id, fields);
    } catch (err) {
        return res.status(400).json({ message: 'Username or email already exists' });
    }

    res.status(200).json({ fields: Object.keys(fields) });
}

export async function deleteOne (req, res) {
    const { id } = req.params;

    try {
        await User.findByIdAndDelete(id);
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
}
