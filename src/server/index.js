const express = require('express');
const config = require('../../config');
const os = require('os');
const mongoDb = require('./mongo');
const mysql = require('./mysql');
const bodyParser = require('body-parser');

const app = express();

app.use(express.static('dist'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Test Route
app.get('/api/getUsername', (req, res) => res.send({ username: os.userInfo().username }));

// DB Calls GET
app.get('/api/food', mysql.getAllFood, function(req,res){});
app.get('/api/food/:id', mysql.getFoodById, function(req,res){});
app.get('/api/meal/history/:startDate/:endDate', mysql.getMealsByDate, function(req,res){});
app.get('/api/meal/:id', mysql.getMealById, function(req,res){});

// DB Calls POST
app.post('/api/food', mysql.createNewFood, function(req,res){});
app.post('/api/meal', mysql.createNewMeal, function(req,res){});

// DB Calls PUT
app.put('/api/mealFood/:mealId/:foodId', mysql.addFoodToMeal, function(req,res){});
app.put('/api/food/:id', mysql.editFoodItem, function(req,res){});

// DB Calls DELETE
app.delete('/api/food/:id', mysql.removeFoodItem, function(req,res){});
app.delete('/api/mealFood/:mealId/:foodId', mysql.removeFoodFromMeal, function(req,res){});
app.delete('/api/meal/:id', mysql.removeMeal, function(req,res){});

// Start Express API Server
app.listen(process.env.PORT || config.server.port, () => console.log(`Listening on port ${process.env.PORT || config.server.port}!`));
