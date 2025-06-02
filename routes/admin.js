// routes/tickets.js or admin.js
import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Admin endpoint working');
});

export default router;

