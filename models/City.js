import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const citySchema = new mongoose.Schema({
  id: { type: String, required: true},
  name: { type: String, required: true}
});

export default mongoose.model('City', citySchema);
