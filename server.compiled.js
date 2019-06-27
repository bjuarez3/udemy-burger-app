"use strict";

var express = require('express');

var app = express();

var bodyParser = require('body-parser');

var jwt = require('jsonwebtoken');

var db = require('./dbjs/db');

var bcrypt = require('bcrypt');

var saltRounds = 10;
var PORT = process.env.HTTP_PORT || 5000;

var path = require('path');

app.use(express["static"](path.join(__dirname, 'client', 'build')));
app.use(bodyParser.json()); // allow CORS

authenticate = function authenticate(req, res, next) {
  var headers = req.headers['authorization'];
  var token = headers.split(' ')[1];
  jwt.verify(token, 'secret', function (err, decoded) {
    if (decoded) {
      if (decoded.email) {
        next();
      } else {
        res.status(401).json({
          message: 'Token invalid'
        });
      }
    } else {
      res.status(401).json({
        message: 'Token invalid'
      });
    }
  });
};

auth = function auth(req, res, token) {
  var success = null;
  jwt.verify(token, 'secret', function (err, decoded) {
    if (decoded) {
      if (decoded.email) {
        success = true;
      } else {
        res.status(401).json({
          message: 'Token invalid'
        });
        success = false;
      }
    } else {
      res.status(401).json({
        message: 'Token invalid'
      });
      success = false;
    }
  });
  return success;
};

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.post('/login', function (req, res) {
  var email = req.body.email;
  var password = req.body.password;
  db.getUserCredentials(email).then(function (user) {
    if (user) {
      bcrypt.compare(password, user.password, function (err, response) {
        if (response) {
          jwt.sign({
            email: email
          }, 'secret', {
            expiresIn: 3600
          }, function (err, token) {
            if (token) {
              res.json({
                token: token,
                userId: user.id,
                expiresIn: 3600
              });
            } else {
              res.status(500).json({
                message: 'Unable to generate token'
              });
            }
          });
        } else {
          res.json({
            error: "Incorrect email and password combination."
          });
        }
      });
    } else {
      res.json({
        error: "Incorrect email and password combination."
      });
    }
  })["catch"](function (error) {
    res.status(500).json(error);
  });
});
app.post('/register', function (req, res) {
  var email = req.body.email;
  var password = req.body.password;
  bcrypt.genSalt(saltRounds, function (err, salt) {
    bcrypt.hash(password, salt, function (err, hash) {
      db.insertUser(email, hash).then(function (user) {
        jwt.sign({
          email: email
        }, 'secret', {
          expiresIn: 3600
        }, function (err, token) {
          if (token) {
            res.json({
              token: token,
              userId: user.id,
              expiresIn: 3600
            });
          } else {
            res.status(500).json({
              message: 'Unable to generate token'
            });
          }
        });
      })["catch"](function (error) {
        console.log(error);
        res.send(error);
      });
    });
  });
});
app.get('/orders/:id/:token', function (req, res) {
  var id = req.params.id;
  var token = req.params.token;

  if (auth(req, res, token)) {
    db.getOrdersByUserId(id).then(function (orders) {
      res.send(orders);
    })["catch"](function (err) {
      res.send(err);
    });
  }
});
app.post('/orders/:token', function (req, res) {
  var order = req.body;
  var token = req.params.token;

  if (auth(req, res, token)) {
    db.insertOrder(order).then(function (response) {
      return res.send(response);
    })["catch"](function (error) {
      return console.log(error);
    });
  }
});
app.get('/ingredients', function (req, res) {
  db.getIngredients().then(function (response) {
    res.send(response);
  })["catch"](function (error) {
    console.log(error);
  });
});
app.listen(PORT, function () {
  console.log("App listening on port 5000");
});
