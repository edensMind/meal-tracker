const express = require('express');
const config = require('../../config');
const os = require('os');

const app = express();

app.use(express.static('dist'));

// Test Route
app.get('/api/getUsername', (req, res) => res.send({ username: os.userInfo().username }));


// Start Express API Server
app.listen(process.env.PORT || config.server.port, () => console.log(`Listening on port ${process.env.PORT || config.server.port}!`));
