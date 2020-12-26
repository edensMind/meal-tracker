const express = require('express');
const config = require('../../config');
const os = require('os');
const mongoDb = require('./mongo');

const app = express();

app.use(express.static('dist'));

// Test Route
app.get('/api/getUsername', (req, res) => res.send({ username: os.userInfo().username }));

// Mongo Test
app.get('/api/mongo', mongoDb.getAllEncounters, function(req,res){});


// Start Express API Server
app.listen(process.env.PORT || config.server.port, () => console.log(`Listening on port ${process.env.PORT || config.server.port}!`));
