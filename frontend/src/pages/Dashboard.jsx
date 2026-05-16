import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {
  const [stats, setStats] = useState({ patients: 0, appointments: 0, reports: 0 });
  const [recentPatients, setRecentPatients] = useState([]);
  const [recentAppointments, setRecentAppointments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const patientsRes = await axios.get(`${import.meta.env.VITE_API_URL}/patients`);
        const appointmentsRes = await axios.get(`${import.meta.env.VITE_API_URL}/appointments`);
        const reportsRes = await axios.get(`${import.meta.env.VITE_API_URL}/reports`);

        setStats({
          patients: Array.isArray(patientsRes.data) ? patientsRes.data.length : 0,
          appointments: Array.isArray(appointmentsRes.data) ? appointmentsRes.data.length : 0,
          reports: Array.isArray(reportsRes.data) ? reportsRes.data.length : 0
        });

        setRecentPatients(Array.isArray(patientsRes.data) ? patientsRes.data.slice(0, 5) : []);
        setRecentAppointments(Array.isArray(appointmentsRes.data) ? appointmentsRes.data.slice(0, 5) : []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2 style={{ borderBottom: 'none', fontSize: '2rem' }}>Dashboard Overview</h2>
      
      <div className="dashboard-grid">
        <div className="page-container" style={{ textAlign: 'center' }}>
          <h3>Total Patients</h3>
          <p style={{ fontSize: '3rem', color: 'var(--primary-color)', margin: '1rem 0' }}>{stats.patients}</p>
        </div>
        <div className="page-container" style={{ textAlign: 'center' }}>
          <h3>Total Appointments</h3>
          <p style={{ fontSize: '3rem', color: 'var(--primary-color)', margin: '1rem 0' }}>{stats.appointments}</p>
        </div>
        <div className="page-container" style={{ textAlign: 'center' }}>
          <h3>Total Reports</h3>
          <p style={{ fontSize: '3rem', color: 'var(--primary-color)', margin: '1rem 0' }}>{stats.reports}</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="page-container">
          <h3>Recent Patients</h3>
          {recentPatients.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Age</th>
                </tr>
              </thead>
              <tbody>
                {recentPatients.map(p => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.age}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No patients registered.</p>
          )}
        </div>

        <div className="page-container">
          <h3>Recent Appointments</h3>
          {recentAppointments.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Patient</th>
                  <th>Doctor</th>
                </tr>
              </thead>
              <tbody>
                {recentAppointments.map(a => (
                  <tr key={a.id}>
                    <td>{new Date(a.appointment_date).toLocaleDateString()}</td>
                    <td>{a.patient_name}</td>
                    <td>{a.doctor_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No appointments booked.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
