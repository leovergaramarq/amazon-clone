import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import filterFields from '../utils/filterFields.js';
import { JWT_SECRET } from '../config.js';

export async function signUp(req, res) {
    const { username, name, email, password, location } = req.body;

    if (!username || !name || !email || !password) {
        return res.status(400).json({ message: 'Please, fill all fields' });
    }

    const newUser = new User(filterFields({
        username, name, email, location,
        password: User.encryptPassword(password),
    }));

    let savedUser;
    try {
        savedUser = await newUser.save();
    } catch (err) {
        return res.status(400).json({ message: 'Username or email already exists' });
    }
    const token = jwt.sign({ id: savedUser._id }, JWT_SECRET, {
        expiresIn: 172800, // 2 days
    });
    
    // res.header('Set-Cookie', `token=${token}; Path=/; HttpOnly; Max-Age=172800; SameSite=Strict; Secure`);
    res.header('Set-Cookie', `token=${token}`);
    res.status(200).json({ token });
}

export async function signIn(req, res) {
    const { username, email, password } = req.body;

    if (!username && !email || !password) {
        return res.status(400).json({ message: 'Please, fill all fields' });
    }

    let user;
    try {
        user = await User.findOne({ $or: [{ username }, { email }] });
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error' });
    }
    if(!user) return res.status(400).json({ message: 'User does not exist' });

    const isMatch = User.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect password' });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
        expiresIn: 172800, // 2 days
    });

    // res.header('Set-Cookie', `token=${token}; Path=/; HttpOnly; Max-Age=172800; SameSite=Strict; Secure`);
    res.header('Set-Cookie', `token=${token}`);
    res.status(200).json({ token });
}
