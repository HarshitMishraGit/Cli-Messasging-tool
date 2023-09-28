const express = require('express');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3001;

// Set up static files and Tailwind CSS
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Set up view engine and views folder
app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));
// server uploads as static files
app.use('/uploads', express.static('uploads'));
// Serve the upload form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
//   res.render('index',{name:"harshitMishra"});
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
    
    var fileUrl = generateRandomID()+files.file[0].originalFilename;
    var oldPath = files.file[0].filepath;
    var newPath = path.join(form.uploadDir,fileUrl);
    fs.rename(oldPath, newPath, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('An error occurred');
      }
        // res.send('File uploaded successfully');
      res.render('result', { path: newPath,url:fileUrl });
    });

  });
});
module.exports = app; // Export the Express app
// app.listen(port, () => {
//   console.log(`Server listening on port ${port}`);
// });

const generateRandomID = () => {
  let id = ``;
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;

  for (let i = 0; i < 5; i++) {
    id += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  id += '-';
  return id;
};
