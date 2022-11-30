import request from 'supertest';
import mongoose from "mongoose";
import { MONGO_URI } from '../config.js';
import express from 'express';
import morgan from 'morgan';
import router from '../routes/index.routes.js';



describe('User', () => {
  let app;
  let user_id;
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

    //Login passed
    test("/login", async () => {
        const response = await request(app).post("/v1/auth/login").send({
            "email": "user1@email.com",
            "password": "123"
        });
        expect(response.statusCode).toBe(200);
    });

    //Login failed wrong password
    test("login fail wrong password", async () => {
        const response = await request(app).post("/v1/auth/login").send({
            "email": "user1@email.com",
            "password": "1234"
        });
        expect(response.statusCode).toBe(400);
    });

    //Login failed wrong email
    test("/login fail wrong email", async () => {
        const response = await request(app).post("/v1/auth/login").send({
            "email": "u@notemail.com",
            "password": "123"
        });
        expect(response.statusCode).toBe(400);
    });

    //Login failed empty email
    test("/login empty email", async () => {
        const response = await request(app).post("/v1/auth/login").send({
            "email": "",
            "password": "123"
        });
        expect(response.statusCode).toBe(400);
    });

    //Login failed empty password
    test("/login empty password", async () => {
        const response = await request(app).post("/v1/auth/login").send({
            "email": "user1@email.com",
            "password": ""
        });
        expect(response.statusCode).toBe(400);
    });

    //Register passed
    test("/register", async () => {
        const response = await request(app).post("/v1/auth/signup").send({
            "username": "user3",                
            "name": "user1",
            "email": "user3@email.com",
            "password": "123"
            
        });
        expect(response.statusCode).toBe(200);
    });

    //Register failed already exist
    test("/register failed already exist", async () => {
        const response = await request(app).post("/v1/auth/signup").send({
            "username": "user1",
            "name": "user1",
            "email": "user3@gmail.com",
            "password": "123"
        });
        expect(response.statusCode).toBe(500);
    });

    //Register failed
    test("/register failed", async () => {
        const response = await request(app).post("/v1/auth/signup").send({
            "name": "user1",
            "email": ""
        });
        expect(response.statusCode).toBe(400);
    });
});