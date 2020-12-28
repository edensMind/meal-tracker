const mysql = require('mysql');
const moment = require('moment');
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
  query( sql, args, res ) {
      return new Promise( ( resolve, reject ) => {
          this.connection.query( sql, args, ( err, rows ) => {
            if ( err ) {
              return res.status(500).send(`Error calling Database: ${err}`);
            }  
            resolve( rows );
          } );
      } );
  }
  close(res) {
      return new Promise( ( resolve, reject ) => {
          this.connection.end( err => {
            if ( err ) {
              return res.status(500).send(`Error calling Database: ${err}`);
            }
            resolve();
          } );
      } );
  }
}

// DB Class Object
let database = new Database(con_config);


////// ROUTE FUNCTIONS - GET //////
// GET All Food
const getAllFood = function(req, res, next) {
  const sql = `
  SELECT id, description, calories, servingSize, image 
  FROM food
  `;

  database.query(sql).then( rows => {
    return res.status(200).send(rows);
  });
};

// GET Single Food by ID
const getFoodById = function(req, res, next) {

  let id = validateIntParam(req.params.id, res);

  const sql = `
  SELECT id, description, calories, servingSize, image 
  FROM food
  WHERE id = ${id}
  `;

  database.query(sql, [], res).then( rows => {
    return res.status(200).send(rows);
  });
};

// GET all meals for time span (since daysBack)
const getMealsByDate = function(req, res, next) {
  const startDate = validateDateParam(req.params.startDate, res);
  const endDate = validateDateParam(req.params.endDate, res);

  const sql = `
  SELECT id, date
  FROM meal
  WHERE 
    DATE(date) BETWEEN 
    '${startDate.getFullYear()}-${startDate.getMonth()+1}-${startDate.getDate()}'
  AND
    '${endDate.getFullYear()}-${endDate.getMonth()+1}-${endDate.getDate()}'
  ORDER BY date DESC
  `;

  // array to hold meal results
  var mealsForTime = [];

  // query all meals for day span
  database.query(sql, [], res).then( meals => {
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

// GET single Meal by ID
const getMealById = function(req, res, next) {
  const id = validateIntParam(req.params.id, res);
  const sql = `
  SELECT id, date
  FROM meal
  WHERE id = ${id}
  `;

  // Object to hold meal results
  let mealObject = {};

  // query all meals for current day
  database.query(sql, [], res).then( meals => {
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
      p = p.then (getFoodForMeal (meal.id, mealObject, meals, res));
    });

    p.then (function () {
      // All promises have finished, arrays are filled
      return res.status(200).send(mealObject);
    });
  });
};

////// ROUTE FUNCTIONS - POST //////
// POST Create New Food Item
const createNewFood = function(req, res, next) {
  console.log("BODY:");
  console.log(req.body);

  // validate food params
  let newFoodObject = {
    id: null,
    description: validateStringParam(req.body.description, res),
    calories: validateIntParam(req.body.calories, res),
    servingSize: validateStringParam(req.body.servingSize, res),
    image: validateStringParam(req.body.image, res),
  };

  const sqlInsert = `
  INSERT INTO food (description, calories, servingSize, image) 
  VALUES (?,?,?,?)
  `;

  const sqlValues = [
    newFoodObject.description,
    newFoodObject.calories,
    newFoodObject.servingSize,
    newFoodObject.image,
  ];

  // execute insert query
  database.query(sqlInsert, sqlValues, res).then( result => {
    // set new inserted food ID to return object
    newFoodObject.id = result.insertId;
    return res.status(200).send(newFoodObject);
  });
};

// POST Create New Meal (with at least one food item)
const createNewMeal = function(req, res, next) {
  console.log("BODY:");
  console.log(req.body);

  // validate food params
  let newMealObject = {
    id: null,
    food: req.body.food,
  };

  // validate food params
  if (!newMealObject.food || newMealObject.food.length < 1) {
    return res.status(400).send("Meal must have at least one food ID.");
  }
  newMealObject.food.forEach(element => {
    validateIntParam(element, res);
  });

  // Insert meal with current timestamp
  const sqlInsert = `
  INSERT INTO meal (date) 
  VALUES (CURRENT_TIMESTAMP)
  `;

  // execute meal insert query
  database.query(sqlInsert, [], res).then( result => {
    // set new inserted food ID to return object
    newMealObject.id = result.insertId;

    // define new primise object
    var p = new Promise (function (res) {res ();});

    // iterate over meal food
    newMealObject.food.forEach(foodId => {
      // execute promises to insert the food for meal
      p = p.then (insertMealFoodRecord (newMealObject.id, foodId));
    });

    p.then (function () {
      // All promises have finished, arrays are filled
      return res.status(200).send(newMealObject);
    });
  });
};


////// ROUTE FUNCTIONS - PUT //////
// PUT Add Food Item to Meal
const addFoodToMeal = function(req, res, next) {
  console.log("BODY:");
  console.log(req.body);

  // validate :id from URL
  let mealId = validateIntParam(req.params.id, res);

  // validate food params from body
  if (!req.body.food || req.body.food.length < 1) {
    return res.status(400).send("Must include at least one food ID.");
  }
  req.body.food.forEach(element => {
    validateIntParam(element, res);
  });

  // define new promise object
  var p = new Promise (function (res) {res ();});

  // iterate over meal food
  req.body.food.forEach(foodId => {
    // execute promises to insert the food for meal
    p = p.then (insertMealFoodRecord (mealId, foodId, res));
  });
  
  p.then (function (err) {
    // All promises have finished, arrays are filled
    return res.status(200).send("Success");
  });
};

// PUT Edit food item by id
const editFoodItem = function(req, res, next) {
  let id = validateIntParam(req.params.id, res);
  
  console.log("BODY:");
  console.log(req.body);

  // build SET statement and collect values for SQL params
  let setStatement = `SET `;
  const sqlValues = [];

  // Parse body parameters
  if(req.body.description && validateStringParam(req.body.description, res)) {
    setStatement += `description = ?, `;
    sqlValues.push(req.body.description);
  }

  if(req.body.calories && validateIntParam(req.body.calories, res)) {
    setStatement += `calories = ?, `;
    sqlValues.push(req.body.calories);
  }

  if(req.body.servingSize && validateStringParam(req.body.servingSize, res)) {
    setStatement += `servingSize = ?, `;
    sqlValues.push(req.body.servingSize);
  }

  if(req.body.image && validateStringParam(req.body.image, res)) {
    setStatement += `image = ?, `;
    sqlValues.push(req.body.image);
  }

  // strip final ", " of SET statement
  setStatement = setStatement.substring(0, setStatement.length - 2);

  // Proceed with valid changes
  if(sqlValues.length > 0) {
    sqlValues.push(id);

    const sql = `
    UPDATE food
    ${setStatement}
    WHERE id = ?
    `;
  
    database.query(sql, sqlValues, res).then( rows => {
      return res.status(200).send("Success");
    });
  }
  else {
    return res.status(400).send("Bad Request: No valid change parameters.");
  }
};

////// ROUTE FUNCTIONS - DELETE //////
// DELETE food item by id
const removeFoodItem = function(req, res, next) {
  let id = validateIntParam(req.params.id, res);

  const sql = `
  DELETE FROM food
  WHERE id = ?
  `;

  const sqlValues = [id];

  database.query(sql, sqlValues, res).then( rows => {
    console.log("Deleted Rows: ", rows.affectedRows);
    if(rows.affectedRows && rows.affectedRows > 0) {
      return res.status(200).send("Success");
    }
    else {
      return res.status(204).send();
    }
  });
};

// DELETE Remove food item FROM meal by id
const removeFoodFromMeal = function(req, res, next) {
  let mealId = validateIntParam(req.params.mealId, res);
  let foodId = validateIntParam(req.params.foodId, res);

  const sql = `
  DELETE FROM meal_food
  WHERE meal_id = ? AND food_id = ?
  `;

  const sqlValues = [mealId, foodId];

  database.query(sql, sqlValues, res).then( rows => {
    console.log("Deleted Rows: ", rows.affectedRows);
    if(rows.affectedRows && rows.affectedRows > 0) {
      return res.status(200).send("Success");
    }
    else {
      return res.status(204).send();
    }
  });
};

// DELETE meal by id
const removeMeal = function(req, res, next) {
  let mealId = validateIntParam(req.params.id, res);

  const sql = `
  DELETE FROM meal
  WHERE id = ?
  `;

  const sqlValues = [mealId];

  database.query(sql, sqlValues, res).then( rows => {
    console.log("Deleted Rows: ", rows.affectedRows);
    if(rows.affectedRows && rows.affectedRows > 0) {
      return res.status(200).send("Success");
    }
    else {
      return res.status(204).send();
    }
  });
};


////// SUPPORT FUNCTIONS //////
// Promise function to return food for a given meal
function getFoodForMeal (mealId, mealObject, todaysMeals, result) {
  return function (prevValue) {
    return new Promise (function (res, rej) {
      const sql = `
      SELECT f.id, f.description, f.calories, f.servingSize, f.image 
      FROM food f
      join meal_food mf ON mf.food_id = f.id
      where mf.meal_id = ${mealId}
      `;
      database.query(sql, [], result).then( rows => {
        mealObject.food = rows;
        todaysMeals.push(mealObject);
        res();
      });
    });
  };
}

// Promise function to insert food for a given meal
function insertMealFoodRecord (mealId, foodId, result) {
  return function (prevValue) {
    return new Promise (function (res, rej) {
      const sql = `
      INSERT INTO meal_food (meal_id, food_id)
      VALUES(?,?)
      `;
      const sqlValues = [mealId, foodId];
      database.query(sql, sqlValues, result).then( rows => {
        res();
      });
    });
  };
}

// Function to validate INT param
function validateIntParam(param, res) {
  if(!isNaN(parseInt(param)) && isFinite(param)) {
    return parseInt(param);
  }
  else {
    return res.status(400).send("Bad Request: Expecting integer value.");
  }
}

// Function to validate DATE param
function validateDateParam(param, res) {
  if(moment(param, "YYYY-MM-DD", true).isValid()) {
    return new Date(`${param}T00:00:00`);
  }
  else {
    return res.status(400).send("Bad Request: Expecting date value - YYYY-MM-DD");
  }
}

// Function to validate STRING param
function validateStringParam(param, res) {
  if(
    param &&
    param.trim() !== '' &&
    param.length <= 100
  ) {
    return param;
  }
  else {
    return res.status(400).send("Bad Request: Expecting valid string value.");
  }
}

// Exports
exports.getAllFood = getAllFood;
exports.getFoodById = getFoodById;
exports.getMealsByDate = getMealsByDate;
exports.getMealById = getMealById;
exports.createNewFood = createNewFood;
exports.createNewMeal = createNewMeal;
exports.addFoodToMeal = addFoodToMeal;
exports.editFoodItem = editFoodItem;
exports.removeFoodItem = removeFoodItem;
exports.removeFoodFromMeal = removeFoodFromMeal;
exports.removeMeal = removeMeal;