//Set up the server
import express from 'express';
let app = express();

import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

const defaultData = { messages: [] };
const adapter = new JSONFile('db.json');
const db = new Low(adapter, defaultData);

//Serve static files from a public folder
app.use(express.static('public'));

//Middleware to parse JSON data
app.use(express.json());

//Set port variable to listen for requests
let port = 3000;
app.listen(port, () => {
  console.log('Server listening on localhost:', port);
});

/*ROUTES */
console.log("Hello?");

//route to serve entries
app.get('/entries', (request, response) => {
  db.read().then(() => {
    // newest first
    let theData = { entries: [...db.data.entries].reverse() };
    response.json(theData);
  });
});

//route to save a new entry
app.post('/newEntry', (request, response) => {
  // read first so a server restart never overwrites old entries
  db.read().then(() => {
    let newEntry = request.body;
    newEntry.time = new Date().toISOString();

    db.data.entries.push(newEntry);
    return db.write();
  }).then(() => {
    response.json({ msg: 'Success' });
  });
});