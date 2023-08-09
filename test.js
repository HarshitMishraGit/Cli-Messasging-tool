const express = require('express');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3001;

// Set up static files and Tailwind CSS
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Serve the upload form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle form submission
app.post('/upload', (req, res) => {
  const form = new formidable.IncomingForm();
  form.uploadDir = path.join(__dirname, 'uploads');
  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error(err);
      return res.status(500).send('An error occurred');
    }

    var oldPath = files.file[0].filepath;
    var newPath = path.join(form.uploadDir, files.file[0].originalFilename);

    fs.rename(oldPath, newPath, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('An error occurred');
      }
        res.send('File uploaded successfully');
    });

  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
