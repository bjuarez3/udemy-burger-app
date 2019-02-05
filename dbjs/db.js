const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('BBDB')

const functions = require('../functions')


db.run(`CREATE TABLE IF NOT EXISTS orders(
    id SERIAL PRIMARY KEY,
    salad INT,
    bacon INT,
    cheese INT,
    meat INT,
    price DOUBLE,
    customer_name VARCHAR(50),
    customer_email VARCHAR(50))`)


module.exports = {
    insertOrder : (orderJSON) => {
        let orderArray = [];
        functions.flattenObjectToArray(orderJSON, orderArray)
        return new Promise((resolve, reject) => {
            db.run(`INSERT INTO orders(salad, bacon, cheese, meat, price, customer_name, customer_email) VALUES(?, ?, ?, ?, ?, ?, ?)`, orderArray, (err) => {
                if(err) {
                    reject(err)
                }
                else {
                    resolve('insert succesfull')
                }
            })
        })
    },
    getIngredients : () => {
        return new Promise((resolve, reject) => {
            db.get(`SELECT salad, bacon, cheese, meat FROM orders`, [], (err, row) => {
                if(err) {
                    reject(err)
                }
                else {
                    resolve(row)
                }
            })
        })
    }
}

