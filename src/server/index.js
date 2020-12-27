const express = require('express');
const config = require('../../config');
const os = require('os');
const mongoDb = require('./mongo');
const mysql = require('./mysql');

const app = express();

app.use(express.static('dist'));

// Test Route
app.get('/api/getUsername', (req, res) => res.send({ username: os.userInfo().username }));

// DB Calls
app.get('/api/food', mysql.getAllFood, function(req,res){});
app.get('/api/food/:id', mysql.getFoodById, function(req,res){});
app.get('/api/meal/today', mysql.getTodaysMeals, function(req,res){});
app.get('/api/meal/:id', mysql.getMealById, function(req,res){});

// app.get('/api/food', mongoDb.getAllFood, function(req,res){});
// app.get('/api/food/:id', mongoDb.getFoodById, function(req,res){});
// app.get('/api/meals/today', mongoDb.getTodaysMeals, function(req,res){});


// Start Express API Server
app.listen(process.env.PORT || config.server.port, () => console.log(`Listening on port ${process.env.PORT || config.server.port}!`));
