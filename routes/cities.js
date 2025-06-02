import express from 'express';
const router = express.Router();
import City from '../models/City.js';


router.get('/get-all-cities', async (req, res) => {
  try {
    const cities = await City.find({}, { _id: 1, name: 1 }).lean();
    const transformed = cities.map(city => ({
      id: city._id.toString(),
      name: city.name
    }));
    res.json(transformed);
  } catch (err) {
    console.error('Failed to fetch cities:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



export default router;
