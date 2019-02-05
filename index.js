const express = require('express')
const app = express()
var bodyParser = require('body-parser')
const db = require('./dbjs/db')


app.use(bodyParser.json())
// allow CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });


app.post('/orders', (req,res) => {
    let order = req.body
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