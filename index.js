var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var massive = require('massive');
var config = require('./config.json');
//Need to enter username and password for your database
var connString = "postgres://postgres:" + config.pass + "@localhost/assessbox";

var app = express();

app.use(bodyParser.json());
app.use(cors());


var controller = require('./js/controller.js');
//The test doesn't like the Sync version of connecting,
//  Here is a skeleton of the Async, in the callback is also
//  a good place to call your database seeds.
var db = massive.connect({connectionString : connString},
  function(err, localdb){
    db = localdb;
    app.set('db', db);

    db.user_create_seed(function(){
      console.log("User Table Init");
    });
    db.vehicle_create_seed(function(){
      console.log("Vehicle Table Init")
    });

    app.get('/api/users', function(req, res, next) {
        db.read_users(function(err, users) {
          if (err) {
            res.status(500).json(err);
          } else {
            res.json(users);
          }
        })
    });

    app.get('/api/vehicles', function(req, res, next) {
      db.read_vehicles(function(err, vehicles) {
        if (err) {
          res.status(500).json(err);
        } else {
          res.json(vehicles);
        }
      })
    });

    app.post('/api/users', function(req, res, next) {
      var firstname=req.body.firstname, lastname=req.body.lastname, email=req.body.email;
      db.create_user([firstname, lastname, email], function(err, user) {
        if (err) {
          res.status(500).json(err);
        } else {
          res.json(user);
        }
      });
    });

    app.post('/api/vehicles', function(req, res, next) {
      var make = req.body.make, model=req.body.model, year=req.body.year, ownerId=req.body.ownerId;
      db.create_vehicle([make, model, year, ownerId], function(err, vehicle) {
        if (err) {
          res.status(500).json(err);
        } else {
          res.json(vehicle);
        }
      });
    });

    app.get('/api/user/:userId/vehiclecount', function(req, res, next) {
      var id = req.params.userId;
      db.count_vehicles([id], function(err, count) {
        if (err) {
          res.status(500).json(err);
        } else {
          res.json(count);
        }
      });
    });

    app.get('/api/user/:userId/vehicle', function(req, res, next) {
      var id = req.params.userId;
      db.all_owner_vehicles([id], function(err, vehicles) {
        if (err) {
          res.status(500).json(err);
        } else {
          res.json(vehicles);
        }
      });
    });

    app.get('/api/vehicle', function(req, res, next) {
      if (req.query.UserEmail) {
        var email = req.query.UserEmail;
        db.read_vehicles_email([email], function(err, vehicles) {
          if (err) {
            console.log('email error: ', err);
            res.status(500).json(err);
          } else {
            res.json(vehicles);
          }
        });
      } else if (req.query.userFirstStart) {
        var letters = req.query.userFirstStart;
        db.read_vehicles_name([letters], function(err, vehicles) {
          if (err) {
            console.log('letters error: ', err);
            res.status(500).json(err);
          } else {
            res.json(vehicles);
          }
        });
      } else {
        res.sendStatus(200);
      }
    });

    app.get('/api/newervehiclesbyyear', function(req, res, next) {
      db.new_vehicles(function(err, vehicles) {
        if (err) {
          res.status(500).json(err);
        } else {
          res.json(vehicles);
        }
      });
    });

    app.put('/api/vehicle/:vehicleId/user/:userId', function(req, res, next) {
      var vehicleId = req.params.vehicleId, userId = req.params.userId;
      db.change_owner([vehicleId, userId], function(err, stuff) {
        if (err) {
          res.status(500).json(err);
        } else {
          res.json(stuff);
        }
      });
    });

    app.delete('/api/user/:userId/vehicle/:vehicleId', function(req, res, next) {
      console.log('something');
      var vehicleId = req.params.vehicleId, userId = req.params.userId;
      db.remove_ownership([vehicleId, userId], function(err, stuff) {
        if (err) {
          console.log(err);
          res.status(500).json(err);
        } else {
          res.sendStatus(200);
        }
      });
    });

    app.delete('/api/vehicle/:vehicleId', function(req, res, next) {
      var id = req.params.vehicleId;
      db.delete_vehicle([id], function(err, stuff) {
        if (err) {
          console.log(err);
          res.status(500).json(err);
        } else {
          res.sendStatus(200);
        }
      });
    });
})

app.listen(config.port, function(){
  console.log("Successfully listening on : " + config.port)
})

module.exports = app;
