import {app} from '../app';
import request from 'supertest';
import mongoose from "mongoose";

describe('User', () => {
    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost:27017/test', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        });
    });
    
    afterAll(async () => {
        await mongoose.connection.close();
    });
    
    it('should create a new user', async () => {
    });
});