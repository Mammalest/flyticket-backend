import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true},
  password: { type: String, required: true}
});

export default mongoose.model('Admin', adminSchema);
