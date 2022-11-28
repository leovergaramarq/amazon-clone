# amazon-clone
Basic REST API to simulate Amazon users, productds, product reviews and purchases.

## Built With
 - [Node.js](https://nodejs.org/es/)

 - [MongoDB Atlas](https://www.mongodb.com/es/atlas)

 - [Visual Studio Code](https://code.visualstudio.com)

## Getting Started
You can clone this repsitory to get the source code

    git clone https://github.com/leovergaramarq/amazon-clone.git

On the project root directory, run

    npm start

This will start your server on port 3000

## Usage
All of the next endpoints start with /v1.

### Authentication
|Method + Enpoint|Resource|JSON Body Fields|Authorization|
|--|--|--|--|
|POST /auth/signup|Sign Up|username, email, password, name, location (optional)||
|POST /auth/login|Login|username/email, password||

### Users
|Method + Enpoint|Resource|JSON Body Fields|Authorization|
|--|--|--|--|
|GET /users|Get all users|||
|GET /users/:id|Get user by id|||
|POST /users|Create user|username, email, password, name, location (optional)||
|PUT /users/:id|Update user by id|(at least one) username, email, password, name, location|X|
|DELETE /users/:id|Delete user by id||X|
|GET /users/:id/reviews|Get reviews from user by id|||
|GET /users/:id/reviews/:id|Get review by id from user by id|||
|GET /users/:id/products|Get products from user by id|||
|GET /users/:id/products/:id|Get product by id from user by id|||
|GET /users/:id/purchases|Get purchases from user by id|||
|GET /users/:id/purchases/:id|Get purchase by id from user by id|||

### Products
|Method + Enpoint|Resource|JSON Body Fields|Authorization|
|--|--|--|--|
|GET /products|Get all products|||
|GET /products/:id|Get product by id|||
|POST /products|Create product|name, category (id or name (can be new)), description, price, stock (optional)|X|
|PUT /products/:id|Update product by id|(at least one) name, description, price, stock, category (id or name (can be new))|X|
|DELETE /products/:id|Delete product by id||X|
|GET /products/:id/reviews|Get reviews about product by id|||
|GET /products/:id/reviews/:id|Get review by id about product by id|||

### Reviews
|Method + Enpoint|Resource|JSON Body Fields|Authorization|
|--|--|--|--|
|GET /reviews|Get all reviews|||
|GET /reviews/:id|Get review by id|||
|POST /reviews|Create review|title, description, product (id)|X|
|DELETE /reviews/:id|Delete review by id||X|

### Categories
|Method + Enpoint|Resource|JSON Body Fields|Authorization|
|--|--|--|--|
|GET /categories|Get all categories|||
|GET /categories/:id|Get category by id|||
|POST /categories|Create category|name|X|
|PUT /categories/:id|Update category name|name|X|
|DELETE /categories/:id|Delete category by id||X|

### Cart
|Method + Enpoint|Resource|JSON Body Fields|Authorization|
|--|--|--|--|
|GET /cart|Get user shopping cart||X|
|POST /cart|Add product to cart|product (id), quantity|X|
|DELETE /cart/:id|Remove product from cart||X|

### Purchase
|Method + Enpoint|Resource|JSON Body Fields|Authorization|
|--|--|--|--|
|GET /purchases|Get all purchases|||
|GET /purchases/:id|Get purchase by id|||
|POST /purchases|Make purchase based on user shopping cart||X|

## Acknowledgements

 - [Insomnia](https://insomnia.rest)
