import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';

export function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({
        message: 'Access denied. Please provide your access token in the Authorizarion header with the Bearer schema.'
    });
    try {
        req.token = jwt.verify(token.split(' ')[1], JWT_SECRET);
        next();
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: 'Invalid token' });
    }
}

export function correctUser(req, res, next) {
    if (req.token.id !== +req.params.id) {
        console.log(req.token.id, req.params.id);
        return res.status(403).json({ message: 'You are not authorized to perform this action' });
    }
    next();
}
