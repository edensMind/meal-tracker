const mongo = require('mongodb');
const config = require('../../config');
var ObjectId = require('mongodb').ObjectId;

// Mongo Server Settings
var mongoConfig = {
  db: null,
  url: `mongodb://${config.db.server}:${config.db.port}/`,
  dbName: 'meal-tracker',
  encountersColl: 'encounters',
  unitsColl: 'units',
  weaponsColl: 'weapons',
  spellsColl: 'spells',
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


// Get One Encoutner By ID (returns its Units members)
var getEncounter = function(req, res, next) {
    var encounterId = req.params.id;
    mongoConfig.db.collection(mongoConfig.unitsColl).find({ memberOf: { $all: [ObjectId(encounterId)] } }).toArray(function(err, units) {
      if (err) {
        return res.status(500).send("Error getting encounter units");
      }
      if (!units) {
        return res.status(204).send();
      }
      else {
        return res.status(200).send(units);
      };
    });
  };

// Get All Encounters
var getAllEncounters = function(req, res, next) {
    mongoConfig.db.collection(mongoConfig.encountersColl).find({}).toArray(function(err, encounters) {
      if (err) {
        return res.status(500).send("Error getting encounters");
      }
      if (!encounters) {
        return res.status(204).send();
      }
      else {
        return res.status(200).send(encounters);
      };
    });
  };


// Create an Encountner
var createEncounter = function(req, res, next) {

    // Define Encounter Object
    var encounterObj = req.body;
    var newParentId = ObjectId();
    encounterObj._id = newParentId;

    // Get Unit Ids
    unitIds = [];
    encounterObj.units.forEach(unit => {
      // create new ID if unit doesn't have one
      var newId = null;
      if(!unit._id) {
        newId = ObjectId();
        unit._id = newId; 
      }
      unitIds.push(unit._id);

      // add member of parent
      unit.memberOf.push(newParentId);

      // insert new units to units collection
      if(newId) {
        mongoConfig.db.collection("units").insertOne(unit, function(err, result) {
          if (err) throw err;
        });
      }

    });

    // set units to ids
    encounterObj.units = unitIds;

    // insert
    mongoConfig.db.collection("encounters").insertOne(encounterObj, function(err, result) {
        if (err) throw err;
        return res.status(200).send(result);
      });
  };

exports.getEncounter = getEncounter;
exports.getAllEncounters = getAllEncounters;
exports.createEncounter = createEncounter;
