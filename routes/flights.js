import express from 'express';
const router = express.Router();
import { v4 as uuidv4 } from 'uuid';
import Flight from '../models/Flight.js';

async function generateUniqueId() {
  let id;
  let exists = true;

  while (exists) {
    id = uuidv4();
    exists = await Flight.exists({ id });
  }

  return id;
}


router.get('/get-flights', async (req, res) => {
  try {
    const flights = await Flight.find().limit(120); // Fetch max 120 flights (3 pages)
    res.json(flights);
  } catch (error) {
    console.error('Error fetching flights:', error);
    res.status(500).json({ error: 'Failed to fetch flights' });
  }
});

router.post('/delete-flight', async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Flight ID is required' });
  }

  try {
    const result = await Flight.deleteOne({ id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Flight not found' });
    }

    res.status(200).json({ message: 'Flight deleted successfully' });
  } catch (err) {
    console.error('Delete flight error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/add-flight', async (req, res) => {
  const { from, to, departureDateTime, arrivalDateTime, price, seats_total } = req.body;

  try {
    // Find City documents by name
    const fromCity = await City.findOne({ name: from });
    const toCity = await City.findOne({ name: to });

    if (!fromCity || !toCity) {
      return res.status(400).json({ message: 'Invalid from or to city name.' });
    }

    // Parse date strings into Date objects
    const depDate = new Date(departureDateTime);
    const arrDate = new Date(arrivalDateTime);

    // Check for conflicting flights (your existing logic)
    const hourStart = new Date(depDate);
    hourStart.setMinutes(0, 0, 0);

    const hourEnd = new Date(depDate);
    hourEnd.setMinutes(59, 59, 999);

    const conflictDeparture = await Flight.findOne({
      from: fromCity._id,
      departure_time: { $gte: hourStart, $lte: hourEnd }
    });

    if (conflictDeparture) {
      return res.status(400).json({ message: "A flight already departs from this city at the same hour." });
    }

    const conflictArrival = await Flight.findOne({
      to: toCity._id,
      arrival_time: arrDate
    });

    if (conflictArrival) {
      return res.status(400).json({ message: "A flight already arrives at this city at the same time." });
    }

    // Generate unique ID
    const id = await generateUniqueId();

    // Create new flight using city ObjectIds
    const newFlight = new Flight({
      id,
      from: fromCity._id,
      to: toCity._id,
      departure_time: depDate,
      arrival_time: arrDate,
      price,
      seats_total,
      seats_available: seats_total
    });

    await newFlight.save();

    res.status(201).json({ message: 'Flight added successfully', flight: newFlight });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
