import Product from '../models/Product.js';
import Purchase from '../models/Purchase.js';
import Review from '../models/Review.js';
import User from '../models/User.js';
import filterFields from '../utils/filterFields.js';

export async function readOne(req, res) {
    let user;
    try {
        user = await User.findById(req.params.id, '-password');
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid user id' });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
}

export async function readMany(req, res) {
    let users;
    try {
        users = await User.find(req.query, '-password');
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error' });
    }

    res.status(200).json(users);
}

export async function createOne(req, res) {
    const { name, email, username, password, location } = req.body;
    if (!name || !email || !username || !password) {
        return res.status(400).json({ message: 'Please, fill all fields' });
    }

    let user;
    try {
        user = await User.create(filterFields({
            name, email, username, location,
            password: await User.encryptPassword(password)
        }));
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: 'Please, fill all the fields' });
        }
        return res.status(400).json({ message: 'Username or email already exists' });
    }

    res.status(201).json({ id: user._id });
}

export async function updateOne(req, res) {
    const { name, email, username, password, location } = req.body;

    if (!name && !email && !username && !password) {
        return res.status(400).json({ message: 'Please, fill at least one field' });
    }

    const fields = filterFields({
        name, email, username, location,
        password: password ? User.encryptPassword(password) : undefined
    });

    try {
        await User.updateOne({ _id: req.params.id }, fields);
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid user id' });
        }
        return res.status(400).json({ message: 'Username or email already exists' });
    }

    res.status(200).json({ fields: Object.keys(fields) });
}

export async function deleteOne(req, res) {
    try {
        await User.deleteOne({ _id: req.params.id });
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid user id' });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
}

// REVIEWS

export async function readReview(req, res) {
    let review;
    try {
        review = await Review.findOne({ user: req.params.id, _id: req.params.reviewId })
            .populate('product', '_id name');
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid review or user id' });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
    if (!review) return res.status(404).json({ message: 'Review not found' });

    res.status(200).json(review);
}

export async function readReviews(req, res) {
    let reviews;
    try {
        reviews = await Review.find({ user: req.params.id })
            .populate('product', '_id name');
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid user id' });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }

    res.status(200).json(reviews);
}

// PRODUCTS

export async function readProduct(req, res) {
    let product;
    try {
        product = await Product.findOne({ user: req.params.id, _id: req.params.productId })
            .populate('category', '_id name');
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid product or user id' });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.status(200).json(product);
}

export async function readProducts(req, res) {
    let products;
    try {
        products = await Product.find({ user: req.params.id })
            .populate('category', '_id name');
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid user id' });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }

    res.status(200).json(products);
}

// // CART

// export async function readCart(req, res) {
//     let cart;
//     try {
//         cart = await Cart.findOne({ user: req.params.id }, '-user')
//             .populate('products.product', '_id name price');
//     } catch (err) {
//         if (err.name === 'CastError') {
//             return res.status(400).json({ message: 'Invalid user id' });
//         }
//         return res.status(500).json({ message: 'Internal server error' });
//     }
//     if (!cart) return res.status(404).json({ message: 'Cart not found' });

//     res.status(200).json(cart);
// }

// export async function addToCart(req, res) {
//     const { product: productId, quantity } = req.body;
//     if (!productId || !quantity) {
//         return res.status(400).json({ message: 'Please, fill all fields' });
//     }

//     if(quantity < 1) {
//         return res.status(400).json({ message: 'Quantity must be greater than 0' });
//     }

//     let product;
//     try {
//         product = await Product.findById(productId);
//     } catch (err) {
//         console.log(err);
//         return res.status(500).json({ message: 'Internal server error' });
//     }
//     if (!product) return res.status(404).json({ message: 'Product not found' });

//     if (product.stock < quantity) {
//         return res.status(400).json({ message: 'Not enough products in stock' });
//     }

//     let cart;
//     try {
//         cart = await Cart.findOne({ user: req.params.id });
//     } catch (err) {
//         if (err.name === 'CastError') {
//             return res.status(400).json({ message: 'Invalid user id' });
//         }
//         return res.status(500).json({ message: 'Internal server error' });
//     }

//     if (!cart) {
//         try {
//             cart = await Cart.create({ user: req.params.id });
//         } catch (err) {
//             return res.status(500).json({ message: 'Internal server error' });
//         }
//     }

//     try {
//         cart = await Cart.findOneAndUpdate(
//             { user: req.params.id },
//             (cart.products?.some(p => p.product.equals(productId)) ?
//                 {
//                     $set: { 'products.$[p].quantity': quantity }
//                 } :
//                 {
//                     $push: { products: { product: productId, quantity } }
//                 }),
//                 { arrayFilters: [{ 'p.product': productId }], new: true }
//         )
//     } catch (err) {
//         return res.status(500).json({ message: 'Internal server error' });
//     }

//     res.status(200).json(cart);
// }

// export async function removeFromCart(req, res) {
//     const { productId } = req.params;
//     if (!productId) {
//         return res.status(400).json({ message: 'Please, fill all fields' });
//     }

//     let product;
//     try {
//         product = await Product.findById(productId);
//     } catch (err) {
//         return res.status(500).json({ message: 'Internal server error' });
//     }
//     if (!product) return res.status(404).json({ message: 'Product not found' });

//     let cart;
//     try {
//         cart = await Cart.findOneAndUpdate(
//             { user: req.params.id },
//             { $pull: { products: { product: productId } } },
//             { new: true }
//         );
//     } catch (err) {
//         if (err.name === 'CastError') {
//             return res.status(400).json({ message: 'Invalid user id' });
//         }
//         return res.status(500).json({ message: 'Internal server error' });
//     }
//     if (!cart) return res.status(404).json({ message: 'Cart not found' });

//     res.status(200).json(cart);
// }

// PURCHASE

// export async function purchase(req, res) {
//     let cart;
//     try {
//         cart = await Cart.findOne({ user: req.params.id });
//     } catch (err) {
//         if (err.name === 'CastError') {
//             return res.status(400).json({ message: 'Invalid user id' });
//         }
//         return res.status(500).json({ message: 'Internal server error' });
//     }
//     if (!cart) return res.status(404).json({ message: 'Cart not found' });

//     const { products } = cart;

//     let purchase;

//     const session = await mongoose.startSession();
//     session.startTransaction();
//     try {
//         try {
//             purchase = await Purchase.create([{
//                 products,
//                 user: req.params.id,
//                 total: await Purchase.calculateTotal(products)
//             }], { session });
//         } catch (err) {
//             await session.abortTransaction();
//             session.endSession();
            
//             if (err.name === 'ValidationError') {
//                 return res.status(400).json({ message: 'Invalid purchase data' });
//             }
//             return res.status(500).json({ message: 'Internal server error' });
//         }

//         try {
//             for (let i = 0; i < products.length; i++) {
//                 await Product.updateOne(
//                     { _id: products[i].product },
//                     { $inc: { stock: -products[i].quantity } },
//                     { session }
//                 );
//             }
//         } catch (err) {
//             await session.abortTransaction();
//             session.endSession();
//             return res.status(500).json({ message: 'Internal server error' });
//         }

//         await session.commitTransaction();
//         session.endSession();
//     } catch (err) {
//         await session.abortTransaction();
//         session.endSession();
//         return res.status(500).json({ message: 'Internal server error' });
//     }
    
//     try {
//         await Cart.updateOne({ user: req.params.id }, { products: [] });
//         // await Cart.deleteOne({ user: req.params.id });
//     } catch (err) {
//         console.log('Could not empty cart');
//         console.log(err);
//     }

//     res.status(200).json(purchase);
// }

// PURCHASES

export async function readPurchase(req, res) {
    let purchase;
    try {
        purchase = await Purchase.findOne({ user: req.params.id, _id: req.params.purchaseId })
            .populate('products.product', '_id name price');
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid purchase or user id' });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
    if (!purchase) return res.status(404).json({ message: 'Purchase not found' });

    res.status(200).json(purchase);
}

export async function readPurchases(req, res) {
    let purchases;
    try {
        purchases = await Purchase.find({ user: req.params.id })
            .populate('products.product', '_id name price');
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid user id' });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }

    res.status(200).json(purchases);
}
