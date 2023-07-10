const { readdirSync } = require('fs');
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const fileDescriptions = [
    { name: 'adapted_ring_pen_holder', description: 'This is the description for adapted_ring_pen_holder' },
    // Add more file objects with name and description properties as needed
  ];
  

const app = express();
app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.post('/upload', upload.single('stlFile'), (req, res) => {
  res.json({ message: 'File uploaded successfully' });
});

app.get('/download/:filename', (req, res) => {
  const file = path.join(__dirname, 'uploads', req.params.filename);
  res.download(file);
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
app.get('/files', (req, res) => {
    const files = fileDescriptions.map((file) => {
      return {
        name: file.name,
        description: file.description,
        url: `/uploads/${file.name}`,
      };
    });
    res.json(files);
  });
