const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('uuid');


// const readFileAsync = util.promisify(fs.readFile);
// const writeFileAsync = util.promisify(fs.writeFile);

const app = express();
const PORT = process.env.PORT || 3001;
    

// Middleware 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Routes for API's 
app.get('/', function(req, res)  {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/notes', function(req, res) {
    res.sendFile(path.join(__dirname, 'public/notes.html'));  
});

app.get('/api/notes/', function (req, res) {
    res.sendFile(path.join(__dirname, '/db/db.json'));
});

// Post function to add notes to database
app.post('/api/notes/', function (req, res) {
    const notes = JSON.parse(fs.readFileSync('./db/db.json'));
    const newNotes = req.body;
    newNotes.id = uuid.v4();
    notes.push(newNotes);
    fs.writeFileSync('./db/db.json', JSON.stringify(notes))
    res.json(notes);
});

// deleting notes from database
app.delete('/api/notes/:id', function (req, res) {
    const notes = JSON.parse(fs.readFileSync('./db/db.json'));
    const delNote = notes.filter((rmvNote) => rmvNote.id !== req.params.id);
    fs.writeFileSync('./db/db.json', JSON.stringify(delNote));
    res.json(delNote);
})



app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, function() {
    console.log('App listing on PORT ' + PORT);
});