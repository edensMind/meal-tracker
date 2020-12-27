const mongo = require('mongodb');
const config = require('../../config');
var ObjectId = require('mongodb').ObjectId;

// Mongo Server Settings
var mongoConfig = {
  db: null,
  url: `mongodb://${config.mongo.user}:${config.mongo.pass}@${config.mongo.host}:${config.mongo.port}/`,
  dbName: 'mealTracker',
  meal: 'meal',
  food: 'food',
};

// Create Mongo Connection 
const MongoClient = mongo.MongoClient;
MongoClient.connect(
    mongoConfig.url, 
    { 
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }, 
    (err, client) => {
    if (err) throw err;
    mongoConfig.db = client.db(mongoConfig.dbName);
});

// Get All Food
var getAllFood = function(req, res, next) {
  mongoConfig.db.collection(mongoConfig.food).find({}).toArray(function(err, allFood) {
    if (err) {
      return res.status(500).send(`Error getting all food: ${err}`);
    }
    if (!allFood) {
      return res.status(204).send();
    }
    else {
      return res.status(200).send(allFood);
    };
  });
};

// Get Single Food by ID
var getFoodById = function(req, res, next) {
  console.log("Num: ", req.params.id);
  const id = parseInt(req.params.id);
  const query = { _id: id };
  mongoConfig.db.collection(mongoConfig.food).find(query).toArray(function(err, food) {
    if (err) {
      return res.status(500).send(`Error getting all food: ${err}`);
    }
    if (!food) {
      return res.status(204).send();
    }
    else {
      return res.status(200).send(food);
    };
  });
};

// Get all meals for today
var getTodaysMeals = function(req, res, next) {
  var today = new Date();
  const query = {
    date: {
      $gte: new Date(today.getFullYear(),today.getMonth(),today.getDate(),0,0,0),
      $lt: new Date(today.getFullYear(),today.getMonth(),today.getDate(),23,59,59)
    }    
  }
  console.log(query);
  mongoConfig.db.collection(mongoConfig.meal).find(query).toArray(function(err, meal) {
    if (err) {
      return res.status(500).send(`Error getting meal: ${err}`);
    }
    if (!meal) {
      return res.status(204).send();
    }
    else {

      return res.status(200).send(meal);
    };
  });
};

exports.getAllFood = getAllFood;
exports.getFoodById = getFoodById;
exports.getTodaysMeals = getTodaysMeals;
