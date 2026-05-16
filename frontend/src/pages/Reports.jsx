import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Reports() {
  const [reports, setReports] = useState([]);
  const [patients, setPatients] = useState([]);
  const [patientName, setPatientName] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchData = async () => {
    try {
      const repRes = await axios.get(`${import.meta.env.VITE_API_URL}/reports`);
      setReports(Array.isArray(repRes.data) ? repRes.data : []);
      const patRes = await axios.get(`${import.meta.env.VITE_API_URL}/patients`);
      const patientsData = Array.isArray(patRes.data) ? patRes.data : [];
      setPatients(patientsData);
      if (patientsData.length > 0 && !patientName) {
        setPatientName(patientsData[0].name);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage({ type: 'error', text: 'Please select a file' });
      return;
    }

    const formData = new FormData();
    formData.append('patient_name', patientName);
    formData.append('report', file);

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/reports/upload-report`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage({ type: 'success', text: 'Report uploaded successfully!' });
      setFile(null);
      // Reset file input
      document.getElementById('reportFile').value = '';
      fetchData();
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to upload report' 
      });
    }
  };

  const formatBytes = (bytes, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  return (
    <div>
      <div className="page-container">
        <h2>Upload Medical Report</h2>
        {message.text && (
          <div className={message.type === 'error' ? 'error-message' : 'success-message'}>
            {message.text}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="dashboard-grid" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label>Patient</label>
              <select value={patientName} onChange={(e) => setPatientName(e.target.value)} required>
                <option value="">Select a patient</option>
                {patients.map(p => (
                  <option key={p.id} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Report File (PDF, JPG, PNG)</label>
              <input type="file" id="reportFile" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} required />
            </div>
          </div>
          <button type="submit" className="btn">Upload Report</button>
        </form>
      </div>

      <div className="page-container">
        <h2>Uploaded Reports</h2>
        {reports.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Patient</th>
                <th>File Name</th>
                <th>Size</th>
                <th>Upload Date</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(r => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.patient_name}</td>
                  <td>
                    <a href={`http://localhost:5000/uploads/${r.file_name}`} target="_blank" rel="noopener noreferrer">
                      {r.original_name}
                    </a>
                  </td>
                  <td>{formatBytes(r.size)}</td>
                  <td>{new Date(r.upload_date).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No reports uploaded.</p>
        )}
      </div>
    </div>
  );
}

export default Reports;
