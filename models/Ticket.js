import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const ticketSchema = new mongoose.Schema({
  passenger_name: String,
  passenger_surname: String,
  passenger_email: String,
  flight_id: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Flight",
    required: true
  } //gets from flight
});

export default mongoose.model('Ticket', ticketSchema);