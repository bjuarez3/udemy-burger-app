const express = require('express')
const app = express()
var bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const db = require('./dbjs/db')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const PORT = process.env.HTTP_PORT || 5000
const path = require('path')

app.use(express.static(path.join(__dirname, 'client', 'build')));
app.use(bodyParser.json())
// allow CORS

authenticate = (req, res, next) => {
    let headers = req.headers['authorization']
    let token = headers.split(' ')[1]

    jwt.verify(token, 'secret', (err, decoded) => {
        if(decoded) {
            if(decoded.email) {
              next()
            } else {
              res.status(401).json({message: 'Token invalid'})
            }
          } else {
            res.status(401).json({message: 'Token invalid'})
          }
    })
}

auth = (req, res, token) => {
  let success = null
  jwt.verify(token, 'secret', (err, decoded) => {
    if(decoded) {
        if(decoded.email) {
          success =  true;
        } else {
          res.status(401).json({message: 'Token invalid'})
          success =  false
        }
      } else {
        res.status(401).json({message: 'Token invalid'})
        success = false
      }
  })
  return success
}

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  app.post('/login',(req, res) => {
    let email = req.body.email
    let password = req.body.password
  
    db.getUserCredentials(email)
    .then(user => {
        if(user) {
            bcrypt.compare(password, user.password, function(err, response) {
              if(response){
                jwt.sign({ email: email }, 'secret', {expiresIn : 3600},function(err, token) {
                  if(token) {
                    res.json({token: token, userId: user.id, expiresIn: 3600})
                  } else {
                    res.status(500).json({message: 'Unable to generate token'})
                  }
                })
              }
              else { 
                res.json({error: "Incorrect email and password combination."})
              }
          });
        }
        else{
          res.json({error: "Incorrect email and password combination."})
        }
    })
    .catch(error => {
      res.status(500).json(error)
    })
  })

app.post('/register', (req,res) => {
  let email = req.body.email
  let password = req.body.password
  bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(password, salt, function(err, hash) {
      db.insertUser(email, hash)
      .then(user => {
        jwt.sign({ email: email }, 'secret', {expiresIn : 3600},function(err, token) {
          if(token) {
            res.json({token: token, userId: user.id, expiresIn: 3600})
          } else {
            res.status(500).json({message: 'Unable to generate token'})
          }
        })
      })
      .catch(error => {console.log(error);res.send(error)})
    })
  })
})

app.get('/orders/:id/:token', (req,res) => {
  let id = req.params.id
  let token = req.params.token
  if(auth(req,res, token)){
    db.getOrdersByUserId(id)
    .then(orders => {res.send(orders)})
    .catch(err => {
      res.send(err)
    })
  }
})

app.post('/orders/:token', (req,res) => {
    let order = req.body
    let token = req.params.token
    if(auth(req,res,token)){
      db.insertOrder(order)
    .then(response => res.send(response))
    .catch(error => console.log(error))
    }
})

app.get('/ingredients', (req,res) => {
    db.getIngredients()
    .then(response => {
        res.send(response)
    })
    .catch(error => {
        console.log(error)
    })
        
})

app.listen(PORT, () => {
    console.log("App listening on port 5000")
})

