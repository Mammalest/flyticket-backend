import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const flightSchema = new mongoose.Schema({
  from: { type: Schema.Types.ObjectId, ref: 'City', required: true },
  to: { type: Schema.Types.ObjectId, ref: 'City', required: true },
  departure_time: { type: Date, required: true },
  arrival_time: { type: Date, required: true },
  price: { type: Number, required: true },
  seats_total: { type: Number, required: true },
  seats_available: { type: Number, required: true }
});

export default mongoose.model('Flight', flightSchema);
