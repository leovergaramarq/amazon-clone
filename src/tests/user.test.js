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
    
    
    test("/user", async () => {
        const response = await request(app).get("/v1/users");
        expect(response.statusCode).toBe(200);
    });
});