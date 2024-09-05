const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

exports.register = (req, res) => {
  const { name, email, password, role, contact, address } = req.body;

  //hash password
  const hashedPassword = bcrypt.hashSync(password, 10);

  //inserting the user into the database
  db.query(
    'INSERT INTO users (name, email, password, role, contact, address) VALUES (?, ?, ?, ?, ?, ?)',
    [name, email, hashedPassword, role, contact, address],
    (err, result) => {
      if (err) return res.status(500).send('Server error');

      const token = jwt.sign({ id: result.insertId, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(201).json({ token });
    }
  );
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  // finding the user using the email
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).send('Server error');
    if (results.length === 0) return res.status(404).send('User not found');

    const user = results[0];

    //comparing the password
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) return res.status(401).send('Invalid credentials');

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  });
};
