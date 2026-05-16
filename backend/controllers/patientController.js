const db = require('../config/db');

exports.registerPatient = async (req, res) => {
  try {
    const { name, age, gender, email, phone_number } = req.body;
    if (!name || !age || !gender || !email || !phone_number) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const [result] = await db.query(
      'INSERT INTO patients (name, age, gender, email, phone_number) VALUES (?, ?, ?, ?, ?)',
      [name, age, gender, email, phone_number]
    );
    res.status(201).json({ message: 'Patient registered successfully', id: result.insertId });
  } catch (error) {
    console.error('Error registering patient:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getPatients = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM patients ORDER BY created_at DESC');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
