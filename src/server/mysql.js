const mysql = require('mysql');
const config = require('../../config');
const ObjectId = require('mongodb').ObjectId;

// MySQL Server Server/Database
const mysqlConfig = {
  dbName: 'MealTracker',
};

// MySQL Connection Config
const con_config = {
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.pass,
  database: mysqlConfig.dbName,
};

// DB Class to submit async queries 
class Database {
  constructor( config ) {
      this.connection = mysql.createConnection(config);
  }
  query( sql, args ) {
      return new Promise( ( resolve, reject ) => {
          this.connection.query( sql, args, ( err, rows ) => {
              if ( err )
                  return reject( err );
              resolve( rows );
          } );
      } );
  }
  close() {
      return new Promise( ( resolve, reject ) => {
          this.connection.end( err => {
              if ( err )
                  return reject( err );
              resolve();
          } );
      } );
  }
}

// DB Class Object
let database = new Database(con_config);

// Get All Food
const getAllFood = function(req, res, next) {
  const sql = `
  SELECT id, description, calories, servingSize, image 
  FROM food
  `;

  database.query(sql).then( rows => {
    return res.status(200).send(rows);
  });
};

// Get Single Food by ID
const getFoodById = function(req, res, next) {
  const sql = `
  SELECT id, description, calories, servingSize, image 
  FROM food
  WHERE id = ${req.params.id}
  `;

  database.query(sql).then( rows => {
    return res.status(200).send(rows);
  });
};

// Get all meals for today
const getTodaysMeals = function(req, res, next) {
  const sql = `
  SELECT id, date
  FROM meal
  WHERE DATE(date) = CURDATE()
  `;

  // array to hold meal results
  var mealsForTime = [];

  // query all meals for current day
  database.query(sql).then( meals => {
    // define new primise object
    var p = new Promise (function (res) {res ();});

    // iterate over found meals
    meals.forEach(meal => {
      // create meal object
      let mealObject = {
        id: meal.id,
        date: meal.date,
        food: []
      };
      // execute promises to get the food for each meal
      p = p.then (getFoodForMeal (meal.id, mealObject, mealsForTime));
    });

    p.then (function () {
      // All promises have finished, arrays are filled
      return res.status(200).send(mealsForTime);
    });
  });
};

// Promise function to return food for a given meal
function getFoodForMeal (mealId, mealObject, todaysMeals) {
  return function (prevValue) {
    return new Promise (function (res, rej) {
      const sql = `
      SELECT f.id, f.description, f.calories, f.servingSize, f.image 
      FROM food f
      join meal_food mf ON mf.food_id = f.id
      where mf.meal_id = ${mealId}
      `;
      database.query(sql).then( rows => {
        mealObject.food = rows;
        todaysMeals.push(mealObject);
        res();
      });
    });
  };
}

// Get single Meal by ID
const getMealById = function(req, res, next) {
  const sql = `
  SELECT id, date
  FROM meal
  WHERE id = ${req.params.id}
  `;

  // Object to hold meal results
  let mealObject = {};

  // query all meals for current day
  database.query(sql).then( meals => {
    // define new primise object
    var p = new Promise (function (res) {res ();});

    // iterate over found meals
    meals.forEach(meal => {
      // alter meal object
      mealObject = {
        id: meal.id,
        date: meal.date,
        food: []
      };
      // execute promises to get the food for each meal
      p = p.then (getFoodForMeal (meal.id, mealObject, meals));
    });

    p.then (function () {
      // All promises have finished, arrays are filled
      return res.status(200).send(mealObject);
    });
  });
};

// Exports
exports.getAllFood = getAllFood;
exports.getFoodById = getFoodById;
exports.getTodaysMeals = getTodaysMeals;
exports.getMealById = getMealById;
