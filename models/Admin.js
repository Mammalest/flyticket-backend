import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const adminSchema = new mongoose.Schema({
  username: String,
  password: String
});

export default model('Admin', adminSchema);
