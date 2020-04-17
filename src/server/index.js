const express = require('express');
const config = require('../../config');
const os = require('os');

const app = express();

app.use(express.static('dist'));
app.get('/api/getUsername', (req, res) => res.send({ username: os.userInfo().username }));

app.listen(process.env.PORT || config.app.apiPort, () => console.log(`Listening on port ${process.env.PORT || config.app.apiPort}!`));
