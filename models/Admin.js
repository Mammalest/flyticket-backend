import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const adminSchema = new mongoose.Schema({
  username: String,
  password: String // bcrypt hashed
});

export default model('Admin', adminSchema);
