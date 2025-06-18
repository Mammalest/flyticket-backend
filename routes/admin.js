import express from 'express';
import Admin from '../models/Admin.js'; // adjust the path to your model
const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    if (admin.password !== password) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    return res.status(200).json({ adminName: admin.username, message: 'Login successful' });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
