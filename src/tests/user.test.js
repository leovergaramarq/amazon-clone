import request from 'supertest';
import mongoose from "mongoose";
import { MONGO_URI } from '../config.js';
import express from 'express';
import morgan from 'morgan';
import router from '../routes/index.routes.js';



describe('User', () => {
  let app;
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
    test("/user", async () => {
        const response = await request(app).get("/v1/users");
        expect(response.statusCode).toBe(200);
    });

    test("/user/:id", async () => {
        const response = await request(app).get("/v1/users/6383dfccebb35967b2945143");
        expect(response.statusCode).toBe(200);
    });

    test("/user/:id/review", async () => {
        const response = await request(app).get("/v1/users/6383dfccebb35967b2945143/reviews");
        expect(response.statusCode).toBe(200);
    });

    test("user/:id/review/:id", async () => {
        const response = await request(app).get("/v1/users/6383dfccebb35967b2945143/reviews/6383e5e49e1fa907cd2e4ad2");
        expect(response.statusCode).toBe(200);
    });

    test("user/:id/products", async () => {
        const response = await request(app).get("/v1/users/6383dfccebb35967b2945143/products");
        expect(response.statusCode).toBe(200);
    });

    test("user/:id/products/:id", async () => {
        const response = await request(app).get("/v1/users/6383dfccebb35967b2945143/products/63841d0e864f966b3d0eb84d");
        expect(response.statusCode).toBe(200);
    });

    test("user/:id/purchases", async () => {
        const response = await request(app).get("/v1/users/6383dfccebb35967b2945143/purchases");
        expect(response.statusCode).toBe(200);
    });

    test("user/:id/purchases/:id", async () => {
        const response = await request(app).get("/v1/users/6383dfccebb35967b2945143/purchases/63840fc17e631a19b7799198");
        expect(response.statusCode).toBe(200);
    });

});