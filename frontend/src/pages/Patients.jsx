import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Patients() {
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({
    name: '', age: '', gender: 'Male', email: '', phone_number: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchPatients = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/patients`);
      setPatients(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/patients`, formData);
      setMessage({ type: 'success', text: 'Patient registered successfully!' });
      setFormData({ name: '', age: '', gender: 'Male', email: '', phone_number: '' });
      fetchPatients();
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to register patient' 
      });
    }
  };

  return (
    <div>
      <div className="page-container">
        <h2>Register New Patient</h2>
        {message.text && (
          <div className={message.type === 'error' ? 'error-message' : 'success-message'}>
            {message.text}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="dashboard-grid" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label>Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Age</label>
              <input type="number" name="age" value={formData.age} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} required>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} required />
            </div>
          </div>
          <button type="submit" className="btn">Register Patient</button>
        </form>
      </div>

      <div className="page-container">
        <h2>Registered Patients</h2>
        {patients.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Email</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              {patients.map(p => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>{p.age}</td>
                  <td>{p.gender}</td>
                  <td>{p.email}</td>
                  <td>{p.phone_number}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No patients found.</p>
        )}
      </div>
    </div>
  );
}

export default Patients;
