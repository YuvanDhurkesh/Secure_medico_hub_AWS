import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({
    patient_name: '', doctor_name: '', appointment_date: '', appointment_reason: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchData = async () => {
    try {
      const apptRes = await axios.get(`${import.meta.env.VITE_API_URL}/appointments`);
      setAppointments(Array.isArray(apptRes.data) ? apptRes.data : []);
      const patRes = await axios.get(`${import.meta.env.VITE_API_URL}/patients`);
      const patientsData = Array.isArray(patRes.data) ? patRes.data : [];
      setPatients(patientsData);
      if (patientsData.length > 0 && !formData.patient_name) {
        setFormData(prev => ({ ...prev, patient_name: patientsData[0].name }));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/appointments`, formData);
      setMessage({ type: 'success', text: 'Appointment booked successfully!' });
      setFormData({ ...formData, doctor_name: '', appointment_date: '', appointment_reason: '' });
      fetchData();
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to book appointment' 
      });
    }
  };

  return (
    <div>
      <div className="page-container">
        <h2>Book Appointment</h2>
        {message.text && (
          <div className={message.type === 'error' ? 'error-message' : 'success-message'}>
            {message.text}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="dashboard-grid" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label>Patient</label>
              <select name="patient_name" value={formData.patient_name} onChange={handleChange} required>
                <option value="">Select a patient</option>
                {patients.map(p => (
                  <option key={p.id} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Doctor Name</label>
              <input type="text" name="doctor_name" value={formData.doctor_name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Date</label>
              <input type="date" name="appointment_date" value={formData.appointment_date} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-group">
            <label>Reason</label>
            <textarea name="appointment_reason" value={formData.appointment_reason} onChange={handleChange} rows="3" required></textarea>
          </div>
          <button type="submit" className="btn">Book Appointment</button>
        </form>
      </div>

      <div className="page-container">
        <h2>Upcoming Appointments</h2>
        {appointments.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map(a => (
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td>{a.patient_name}</td>
                  <td>{a.doctor_name}</td>
                  <td>{new Date(a.appointment_date).toLocaleDateString()}</td>
                  <td>{a.appointment_reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No appointments found.</p>
        )}
      </div>
    </div>
  );
}

export default Appointments;
