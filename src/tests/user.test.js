import request from 'supertest';
import mongoose from "mongoose";
import { MONGO_URI } from '../config.js';
import express from 'express';
import morgan from 'morgan';
import router from '../routes/index.routes.js';



describe('User', () => {
  let app;
  let user_id;
  let token;
    beforeAll(async () => {
        app= express();

        app.set('json spaces', 2);
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(morgan('dev'));
        
        app.get('/', (req, res) => {
            res.send('Hello World!');
        });
        app.use('/v1', router);
        app.use((req, res) => {
            res.status(404).json({ message: 'Not found' });
        });
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };
            const db = await mongoose.connect(MONGO_URI ,options);
            console.log(`Connection to database ${db.connection.name} successful`)
    
    });
    
    afterAll(async () => {
        await mongoose.connection.close();
    });
    
    // GETS ALL USERS
    test("/users ge5t", async () => {
        const response = await request(app).get("/v1/users");
        expect(response.statusCode).toBe(200);
    });

    //get user by id
    test("/users/:id get by id", async () => {
        const response = await request(app).get("/v1/users/6383dfccebb35967b2945143");
        expect(response.statusCode).toBe(200);
    });

    //fail get user by id
    test("/users/:id get by id failed", async () => {
        const response = await request(app).get("/v1/users/638");
        expect(response.statusCode).toBe(400);
    });

    //get user reviews
    test("/users/:id/review get user reviews", async () => {
        const response = await request(app).get("/v1/users/6383dfccebb35967b2945143/reviews");
        expect(response.statusCode).toBe(200);
    });

    //fail get user reviews
    test("/users/:id/review get user reviews failed", async () => {
        const response = await request(app).get("/v1/users/638/reviews");
        expect(response.statusCode).toBe(400);
    });

    //get user reviews by id
    test("/users/:id/review/:id get user review by id", async () => {
        const response = await request(app).get("/v1/users/6383dfccebb35967b2945143/reviews/6383e5e49e1fa907cd2e4ad2");
        expect(response.statusCode).toBe(200);
    });
    //fail get user reviews by id
    test("/users/:id/review/:id get user review by id failed", async () => {
        const response = await request(app).get("/v1/users/6383dfccebb35967b2945143/reviews/638");
        expect(response.statusCode).toBe(400);
    });

    //get user products
    test("/users/:id/products get", async () => {
        const response = await request(app).get("/v1/users/6383dfccebb35967b2945143/products");
        expect(response.statusCode).toBe(200);
    });

    //fail get user products
    test("/users/:id/products get failed", async () => {
        const response = await request(app).get("/v1/users/638/products");
        expect(response.statusCode).toBe(400);
    });

    //get user products by id
    test("/users/:id/products/:id get by id", async () => {
        const response = await request(app).get("/v1/users/6383dfccebb35967b2945143/products/63841d0e864f966b3d0eb84d");
        expect(response.statusCode).toBe(200);
    });

    //fail get user products by id
    test("/users/:id/products/:id get by id failed", async () => {
        const response = await request(app).get("/v1/users/6383dfccebb35967b2945143/products/638");
        expect(response.statusCode).toBe(400);
    });

    //get user purchases
    test("/users/:id/purchases get", async () => {
        const response = await request(app).get("/v1/users/6383dfccebb35967b2945143/purchases");
        expect(response.statusCode).toBe(200);
    });

    //fail get user purchases
    test("/users/:id/purchases get failed", async () => {
        const response = await request(app).get("/v1/users/638/purchases");
        expect(response.statusCode).toBe(400);
    });

    //get user purchases by id
    test("/users/:id/purchases/:id get", async () => {
        const response = await request(app).get("/v1/users/6383dfccebb35967b2945143/purchases/63840fc17e631a19b7799198");
        expect(response.statusCode).toBe(200);
    });

    //fail get user purchases by id
    test("/users/:id/purchases/:id get failed", async () => {
        const response = await request(app).get("/v1/users/6383dfccebb35967b2945143/purchases/638");
        expect(response.statusCode).toBe(400);
    });

    // POSTS A NEW USER
    test("/users post", async () => {
        const response = await request(app).post("/v1/users").send({
            "name": "Test",
            "email": "test@corre.com",
            "password": "123",
            "username": "tester"
        });
        expect(response.statusCode).toBe(201);
        user_id = response.body.id;
        console.log(user_id)
    });

    //fail post user
    test("/users post failed", async () => {
        const response = await request(app).post("/v1/users").send({
            "name": "Test",
            "email": "",
            "passwoord": "",
            "username": ""
        });
        expect(response.statusCode).toBe(400);
    });


    
    // UPDATES A USER
    test("/users/:id update", async () => {
        token = await request(app).post("/v1/auth/login").send({
            "email": "test@corre.com",
            "password":"123"
        });
        const response = await request(app).put("/v1/users/"+user_id).send({
            "name": "Test",
            "email": "test@correo.com"
        }).set('Authorization', 'Bearer '+token.body.token);
        expect(response.statusCode).toBe(200);
    });

    //fail update user no token 
    test("/users/:id update failed no token", async () => {
        const response = await request(app).put("/v1/users/"+user_id).send({
            "name": "Test",
            "email": ""
        });
        expect(response.statusCode).toBe(401);
    });

    //fail update user wrong token
    test("/users/:id update failed wrong token", async () => {
        token = await request(app).post("/v1/auth/login").send({
            "email": "test@corre.com",
            "password":"123"
        });
        const response = await request(app).put("/v1/users/"+user_id).send({
            "name": "Test",
            "email": "test@correo.com"
        }).set('Authorization', 'Bearer '+token.body.token+"123");
        expect(response.statusCode).toBe(400);
    });

            
   
     //fail delete user wrong token
     test("/users/:id delete failed wrong token", async () => {
        token = await request(app).post("/v1/auth/login").send({
            "email": "test@correo.com",
            "password":"123" 
        });
        const response = await request(app).delete("/v1/users/"+user_id).set('Authorization', 'Bearer '+token.body.token+"123");
        expect(response.statusCode).toBe(400);
    });

     //fail delete user no token
     test("/users/:id delete failed no token", async () => {
        const response = await request(app).delete("/v1/users/"+user_id);
        expect(response.statusCode).toBe(401);
    });

    //delete user not permitted
    test("/users/:id delete failed not permitted", async () => {
        token = await request(app).post("/v1/auth/login").send({
            "email": "test@correo.com",
            "password":"123"
        });
        const response = await request(app).delete("/v1/users/638414b51bad7d3c9aada081").set('Authorization', 'Bearer '+token.body.token);
        expect(response.statusCode).toBe(403);
    });
     // DELETES A USER
    test("/users/:id delete", async () => {
        token = await request(app).post("/v1/auth/login").send({
            "email": "test@correo.com",
            "password":"123"
        });
        const response = await request(app).delete("/v1/users/"+user_id).set('Authorization', 'Bearer '+token.body.token);
        expect(response.statusCode).toBe(200);
    });     
});