const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();
const db = require('../config/db');

router.post('/book', authMiddleware, (req, res) => {
  const { provider_id, appointment_date } = req.body;
  const patient_id = req.user.id;

  db.query(
    'INSERT INTO appointments (patient_id, provider_id, appointment_date) VALUES (?, ?, ?)',
    [patient_id, provider_id, appointment_date],
    (err, result) => {
      if (err) return res.status(500).send('Server error');
      res.status(201).json({ message: 'Appointment booked successfully' });
    }
  );
});

router.get('/provider/:id', authMiddleware, (req, res) => {
  const provider_id = req.params.id;

  db.query(
    'SELECT * FROM appointments WHERE provider_id = ?',
    [provider_id],
    (err, results) => {
      if (err) return res.status(500).send('Server error');
      res.status(200).json(results);
    }
  );
});

module.exports = router;
