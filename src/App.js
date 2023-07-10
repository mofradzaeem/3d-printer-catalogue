import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [fileDescription, setFileDescription] = useState('');


  async function fetchFiles() {
    try {
      const response = await axios.get('http://localhost:5000/files');
      setFiles(response.data);
    } catch (error) {
      console.error('Error fetching files:', error);
      alert('Error fetching files');
    }
  }

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    const file = fileInputRef.current.files[0];
  
    if (!file) {
      alert('Please select a file to upload');
      return;
    }
  
    const formData = new FormData();
    formData.append('stlFile', file);
    formData.append('description', fileDescription);
  
    try {
      await axios.post('http://localhost:5000/upload', formData);
      alert('File uploaded successfully');
      fetchFiles();
      setFileDescription(''); // Clear the file description input field after upload
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file');
    }
  };

  const handleDownload = async (filename) => {
    try {
      const response = await axios.get(`http://localhost:5000/download/${filename}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Error downloading file');
    }
  };

  return (
    <div className="App">
      <h1>3D Printer Catalog</h1>
      <form onSubmit={handleUpload}>
      <input
      type="text"
      value={fileDescription}
      onChange={(e) => setFileDescription(e.target.value)}
      placeholder="File description"
      />

        <input type="file" ref={fileInputRef} accept=".stl" />
        <button type="submit">Upload</button>
      </form>
      <div className="file-list">
        {files.map((file) => (
          <div key={file.name} className="file-item">
            <span className="file-name">{file.name}</span>
            <span className="file-description">{file.description}</span>
            <button onClick={() => handleDownload(file.name)}>Download</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
