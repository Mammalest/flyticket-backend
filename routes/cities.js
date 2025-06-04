import express from 'express';
const router = express.Router();
import City from '../models/City.js';


router.get('/get-all-cities', async (req, res) => {
  try {
    // Find all cities, only get the `name` field
    const cities = await City.find({}, { name: 1, _id: 0 }).lean();

    // Map to array of names (strings only)
    const cityNames = cities.map(city => city.name);

    // Send array of strings
    res.json(cityNames);
  } catch (err) {
    console.error('Failed to fetch cities:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




export default router;
