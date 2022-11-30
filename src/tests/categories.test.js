import request from 'supertest';
import mongoose from "mongoose";
import { MONGO_URI } from '../config.js';
import express from 'express';
import morgan from 'morgan';
import router from '../routes/index.routes.js';



describe('User', () => {
  let app;
  let category_id;
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

    //Get all categories
    test("/categories", async () => {
        const response = await request(app).get("/v1/categories");
        expect(response.statusCode).toBe(200);
    });

    //Get category by id
    test("/categories/:id", async () => {
        const response = await request(app).get("/v1/categories/6383e2918084f97b16b04640");
        expect(response.statusCode).toBe(200);
    });

    //get category by id bad request
    test("/categories/:id", async () => {
        const response = await request(app).get("/v1/categories/638");
        expect(response.statusCode).toBe(400);
    });

    //post category
    test("/categories", async () => {
        const token = await request(app).post("/v1/auth/login").send({
            "username": "user1",                
            "password": "123"
        });
        const response = await request(app).post("/v1/categories").send({
            "name": "test"
        }).set('authorization', `Bearer ${token.body.token}`);
        expect(response.statusCode).toBe(201);
        category_id = response.body._id;
    });

    //post category no token
    test("/categories", async () => {
        const response = await request(app).post("/v1/categories").send({
            "name": "test"
        });
        expect(response.statusCode).toBe(401);
    });

    //post category wrong token
    test("/categories", async () => {
        const token = await request(app).post("/v1/auth/login").send({
            "username": "user1",                
            "password": "123"
        });
        const response = await request(app).post("/v1/categories").send({
            "name": "test"
        }).set('authorization', `Bearer ${token.body.token}12`);
        expect(response.statusCode).toBe(400);
    });

    //post category bad request
    test("/categories", async () => {
        const token = await request(app).post("/v1/auth/login").send({
            "username": "user1",                
            "password": "123"
        });
        const response = await request(app).post("/v1/categories").send({
            
        }).set('authorization', `Bearer ${token.body.token}`);
        expect(response.statusCode).toBe(400);
    });

    //update category
    test("/categories/:id", async () => {
        const token = await request(app).post("/v1/auth/login").send({
            "username": "user1",                
            "password": "123"
        });
        const response = await request(app).put("/v1/categories/"+category_id).send({
            "name": "tester"
        }).set('authorization', `Bearer ${token.body.token}`);
        expect(response.statusCode).toBe(200);
    });

    //update category no token
    test("/categories/:id", async () => {
        const response = await request(app).put("/v1/categories/"+category_id).send({
            "name": "tester"
        });
        expect(response.statusCode).toBe(401);
    });

    //update category wrong token
    test("/categories/:id", async () => {
        const token = await request(app).post("/v1/auth/login").send({
            "username": "user1",
            "password": "123"
        });
        const response = await request(app).put("/v1/categories/"+category_id).send({
            "name": "tester"
        }).set('authorization', `Bearer ${token.body.token}12`);
        expect(response.statusCode).toBe(400);
    });

    //update category bad request
    test("/categories/:id", async () => {
        const token = await request(app).post("/v1/auth/login").send({
            "username": "user1",
            "password": "123"
        });
        const response = await request(app).put("/v1/categories/"+category_id).send({
            
        }).set('authorization', `Bearer ${token.body.token}`);
        expect(response.statusCode).toBe(400);
    });



    //delete category
    test("/categories/:id", async () => {
        const token = await request(app).post("/v1/auth/login").send({
            "username": "user1",                
            "password": "123"
        });
        const response = await request(app).delete("/v1/categories/"+category_id).set('authorization', `Bearer ${token.body.token}`);
        expect(response.statusCode).toBe(200);
    });

    //delete category no token
    test("/categories/:id", async () => {
        const response = await request(app).delete("/v1/categories/"+category_id);
        expect(response.statusCode).toBe(401);
    });

    //delete category wrong token
    test("/categories/:id", async () => {
        const token = await request(app).post("/v1/auth/login").send({
            "username": "user1",
            "password": "123"
        });
        const response = await request(app).delete("/v1/categories/"+category_id).set('authorization', `Bearer ${token.body.token}12`);
        expect(response.statusCode).toBe(400);
    });
    
    //delete category bad request
    test("/categories/:id", async () => {
        const token = await request(app).post("/v1/auth/login").send({
            "username": "user1",
            "password": "123"
        });
        const response = await request(app).delete("/v1/categories/638").set('authorization', `Bearer ${token.body.token}`);
        expect(response.statusCode).toBe(400);
    });
});