// routes/tickets.js or admin.js
import express from 'express';
const router = express.Router();
import { v4 as uuidv4 } from 'uuid';
import Ticket from '../models/Ticket.js';

async function generateUniqueId() {
  let ticket_id;
  let exists = true;

  while (exists) {
    ticket_id = uuidv4();
    exists = await Ticket.exists({ ticket_id });
  }

  return ticket_id;
}


router.get('/get-ticket-by-email', async (req, res) => {
  try {
    const { passenger_email } = req.query; // get from query string
    
    if (!passenger_email) {
      return res.status(400).json({ message: 'passenger_email is required' });
    }
    
    // Find tickets with matching passenger_email
    const tickets = await Ticket.find({ passenger_email }).exec();
    
    res.status(200).json(tickets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/add-ticket', async (req, res) => {
  const {passenger_name, passenger_surname, passenger_email, flight_id} = req.body;
  try {
  const ticket_id = await generateUniqueId();

  const newTicket = new Ticket({
    ticket_id,
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
    const result = await Ticket.deleteOne({ id });

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