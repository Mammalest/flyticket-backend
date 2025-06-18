import express from 'express';
const router = express.Router();
import Flight from '../models/Flight.js';
import City from '../models/City.js';



router.get('/get-flights', async (req, res) => {
  try {
    const flights = await Flight.find()
      .limit(120)
      .populate('from', 'name') // populate only the 'name' field
      .populate('to', 'name');

    // Transform flight data to include only city names
    const simplifiedFlights = flights.map(flight => ({
      id: flight._id,
      from: flight.from.name,
      to: flight.to.name,
      departure_time: flight.departure_time,
      arrival_time: flight.arrival_time,
      price: flight.price,
      seats_total: flight.seats_total,
      seats_available: flight.seats_available
    }));

    res.json(simplifiedFlights);
  } catch (error) {
    console.error('Error fetching flights:', error);
    res.status(500).json({ error: 'Failed to fetch flights' });
  }
});

router.get('/get-flight-from-id', async (req, res) => {
  try {
    const { flight_id } = req.query;

    if (!flight_id) {
      return res.status(400).json({ message: 'flight_id not provided' });
    }

    // Fetch the flight by its ID
  const flight = await Flight.findOne({ _id: flight_id }).populate('from').populate('to').exec();

    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }

    // Send simplified response
    const tempFlight = {
      id: flight._id,
      from: flight.from.name,
      to: flight.to.name,
      departure_time: flight.departure_time,
      arrival_time: flight.arrival_time,
      departure_date: flight.departure_date,
      arrival_date: flight.arrival_date,
      price: flight.price,
      seats_total: flight.seats_total,
      seats_available: flight.seats_available
    };

    res.status(200).json(tempFlight);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/delete-flight', async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Flight ID is required' });
  }

  try {
    const result = await Flight.deleteOne({ _id: id });

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


    // Create new flight using city ObjectIds
    const newFlight = new Flight({
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


router.put('/update-flight/:flight_id', async (req, res) => {
  const { flight_id } = req.params;
  const { from, to, departureDateTime, arrivalDateTime, price, seats_total } = req.body;

  try {
    // Find the cities by name
    const fromCity = await City.findOne({ name: from });
    const toCity = await City.findOne({ name: to });

    if (!fromCity || !toCity) {
      return res.status(400).json({ error: 'Invalid from or to city name.' });
    }

    // Parse dates
    const departureDate = new Date(departureDateTime);
    const arrivalDate = new Date(arrivalDateTime);

    if (isNaN(departureDate.getTime()) || isNaN(arrivalDate.getTime())) {
      return res.status(400).json({ error: 'Invalid date format.' });
    }

    // Find and update the flight
    const updatedFlight = await Flight.findByIdAndUpdate(
      flight_id,
      {
        from: fromCity._id,
        to: toCity._id,
        departure_time: departureDate,
        arrival_time: arrivalDate,
        price,
        seats_total,
        seats_available: seats_total // optionally reset seats_available on update, or keep as is if you prefer
      },
      { new: true } // return the updated document
    ).populate('from', 'name').populate('to', 'name');

    if (!updatedFlight) {
      return res.status(404).json({ error: 'Flight not found' });
    }

    // Respond with updated flight info
    res.json({
      id: updatedFlight._id,
      from: updatedFlight.from.name,
      to: updatedFlight.to.name,
      departure_time: updatedFlight.departure_time,
      arrival_time: updatedFlight.arrival_time,
      price: updatedFlight.price,
      seats_total: updatedFlight.seats_total,
      seats_available: updatedFlight.seats_available,
    });
  } catch (err) {
    console.error('Error updating flight:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
