import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db.js';

import flightsRouter from './routes/flights.js';
import ticketsRouter from './routes/tickets.js';
import adminRouter from './routes/admin.js';
import citiesRouter from './routes/cities.js';

dotenv.config();

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/flights', flightsRouter);
app.use('/tickets', ticketsRouter);
app.use('/admin', adminRouter);
app.use('/cities', citiesRouter);


app.get('/', (req, res) => res.send('FlyTicket API Running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

