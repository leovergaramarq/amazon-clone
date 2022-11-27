import './db.js';
import express from 'express';
import morgan from 'morgan';
import router from './routes/index.routes.js';

const app = express();

app.set('json spaces', 2);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use('/v1', router);
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

export default app;
