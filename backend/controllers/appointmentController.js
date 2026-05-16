const db = require('../config/db');

exports.bookAppointment = async (req, res) => {
  try {
    const { patient_name, doctor_name, appointment_date, appointment_reason } = req.body;
    if (!patient_name || !doctor_name || !appointment_date || !appointment_reason) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const [result] = await db.query(
      'INSERT INTO appointments (patient_name, doctor_name, appointment_date, appointment_reason) VALUES (?, ?, ?, ?)',
      [patient_name, doctor_name, appointment_date, appointment_reason]
    );
    res.status(201).json({ message: 'Appointment booked successfully', id: result.insertId });
  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAppointments = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM appointments ORDER BY appointment_date ASC');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
