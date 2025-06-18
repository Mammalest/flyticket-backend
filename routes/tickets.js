// routes/tickets.js or admin.js
import express from 'express';
const router = express.Router();
import { v4 as uuidv4 } from 'uuid';
import Ticket from '../models/Ticket.js';


router.get('/get-tickets-from-email', async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: 'email is required' });
    }

    // Find tickets by passenger_email and populate flight details
    const tickets = await Ticket.find({ passenger_email: email }).populate({
      path: 'flight',
      select: 'from to departure_time arrival_time price seats_total',
      populate: [
        { path: 'from', select: 'name' },
        { path: 'to', select: 'name' }
      ]
    }).exec();

    // Map tickets to the desired response format
    const responseData = tickets.map(ticket => {
      const flight = ticket.flight;
      if (!flight) {
        return null; // handle missing flight if needed
      }

      const departureISO = flight.departure_time.toISOString();
      const arrivalISO = flight.arrival_time.toISOString();

      const [departure_date, departure_time] = departureISO.split('T');
      const [arrival_date, arrival_timeWithTZ] = arrivalISO.split('T');
      const arrival_time = arrival_timeWithTZ.split('.')[0]; // remove milliseconds

      return {
        ticket_id: ticket._id.toString(),
        flight_id: flight._id.toString(),
        from: flight.from.name,
        to: flight.to.name,
        departure_time,
        arrival_time,
        departure_date,
        arrival_date,
        price: flight.price,
        seats_total: flight.seats_total
      };
    }).filter(item => item !== null);

    res.status(200).json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});



router.post('/add-ticket', async (req, res) => {
  const {passenger_name, passenger_surname, passenger_email, flight_id} = req.body;
  try {
  const newTicket = new Ticket({
    passenger_name,
    passenger_surname,
    passenger_email,
    flight_id
  });

  await newTicket.save();

  res.status(201).json({ message: 'Ticket booked successfully', ticket: newTicket });
  } catch (err) {
  console.error(err);
  res.status(500).json({ message: 'Server error' });
  }
});

router.post('/delete-ticket', async (req, res) => {
  const { ticket_id } = req.body;

  if (!ticket_id) {
    return res.status(400).json({ error: 'ticket id is required' });
  }

  try {
    const result = await Ticket.deleteOne({ _id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.status(200).json({ message: 'Ticket deleted successfully' });
  } catch (err) {
    console.error('Delete Ticket error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;