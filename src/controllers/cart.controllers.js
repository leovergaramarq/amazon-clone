import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// export async function readOne (req, res) {
//     let cart;
//     try {
//         cart = await Cart.findById(req.params.id)
//             .populate('user', '_id username')
//             .populate('products.product', '_id name price');
//     } catch (err) {
//         if(err.name === 'CastError') {
//             return res.status(400).json({ message: 'Invalid cart id' });
//         }
//         return res.status(500).json({ message: 'Internal server error' });
//     }
//     if (!cart) return res.status(404).json({ message: 'Cart not found' });

//     res.status(200).json(cart);
// }

// export async function readMany (req, res) {
//     let carts;
//     try {
//         carts = await Cart.find(req.query)
//             .populate('user', '_id username')
//             .populate('products.product', '_id name price');
//     } catch (err) {
//         return res.status(500).json({ message: 'Internal server error' });
//     }

//     res.status(200).json(carts);
// }

export async function readOne(req, res) {
    let cart;
    try {
        cart = await Cart.findOne({ user: req.token.id }, '-user')
            .populate('products.product', '_id name price');
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid user id' });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    res.status(200).json(cart);
}

export async function addProduct(req, res) {
    const { product: productId, quantity } = req.body;
    if (!productId || !quantity) {
        return res.status(400).json({ message: 'Please, fill all fields' });
    }

    if(quantity < 1) {
        return res.status(400).json({ message: 'Quantity must be greater than 0' });
    }

    let product;
    try {
        product = await Product.findById(productId);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.stock < quantity) {
        return res.status(400).json({ message: 'Not enough products in stock' });
    }

    let cart;
    try {
        cart = await Cart.findOne({ user: req.token.id });
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid user id' });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }

    if (!cart) {
        try {
            cart = await Cart.create({ user: req.token.id });
        } catch (err) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    try {
        cart = await Cart.findOneAndUpdate(
            { user: req.token.id },
            (cart.products?.some(p => p.product.equals(productId)) ?
                {
                    $set: { 'products.$[p].quantity': quantity }
                } :
                {
                    $push: { products: { product: productId, quantity } }
                }),
                { new: true }
        )
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error' });
    }

    res.status(200).json(cart);
}

export async function removeProduct(req, res) {
    const { productId } = req.params;
    if (!productId) {
        return res.status(400).json({ message: 'Please, fill all fields' });
    }

    let product;
    try {
        product = await Product.findById(productId);
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error' });
    }
    if (!product) return res.status(404).json({ message: 'Product not found' });

    let cart;
    try {
        cart = await Cart.findOneAndUpdate(
            { user: req.token.id },
            { $pull: { products: { product: productId } } },
            { new: true }
        );
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid user id' });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    res.status(200).json(cart);
}

