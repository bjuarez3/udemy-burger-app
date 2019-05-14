const express = require('express')
const app = express()
var bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const db = require('./dbjs/db')

app.use(bodyParser.json())
// allow CORS

authenticate = (req, res, next) => {
    let headers = req.headers['authorization']
    let token = headers.split(' ')[1]

    jwt.verify(token, 'secret', (err, decoded) => {
        if(decoded) {
            if(decoded.username) {
              next()
            } else {
              res.status(401).json({message: 'Token invalid'})
            }
          } else {
            res.status(401).json({message: 'Token invalid'})
          }
    })
}

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  app.post('/login',(req, res) => {
    let email = req.body.email
    let password = req.body.password
  
    db.userExists(email, password)
    .then(user => {
        if(user) {
            console.log("user exists")
            jwt.sign({ email: email }, 'secret', function(err, token) {
                if(token) {
                  res.json({token: token})
                } else {
                  res.status(500).json({message: 'Unable to generate token'})
                }
            });
        }
    })
  })

app.get('/orders', (req,res) => {
    db.getAllOrders()
    .then(orders => res.send(orders))
    .catch(error => console.log(error))
})

app.post('/orders', (req,res) => {
    let order = req.body
    console.log(order)
    db.insertOrder(order)
    .then(response => res.send(response))
    .catch(error => console.log(error))
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

app.listen(5000, () => {
    console.log("App listening on port 5000")
})

