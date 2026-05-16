const db = require('../config/db');

exports.uploadReport = async (req, res) => {
  try {
    const { patient_name } = req.body;
    if (!patient_name) {
      return res.status(400).json({ error: 'Patient name is required' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'Report file is required' });
    }

    const { filename, originalname, mimetype, size } = req.file;

    const [result] = await db.query(
      'INSERT INTO reports (patient_name, file_name, original_name, mime_type, size) VALUES (?, ?, ?, ?, ?)',
      [patient_name, filename, originalname, mimetype, size]
    );

    res.status(201).json({ 
      message: 'Report uploaded successfully', 
      id: result.insertId,
      file: { filename, originalname, mimetype, size }
    });
  } catch (error) {
    console.error('Error uploading report:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getReports = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM reports ORDER BY upload_date DESC');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
