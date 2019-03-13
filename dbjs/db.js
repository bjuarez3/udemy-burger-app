const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('BBDB')

const functions = require('../functions')

db.run(`CREATE TABLE IF NOT EXISTS orders(
    salad INT,
    bacon INT,
    cheese INT,
    meat INT,
    price DOUBLE,
    customer_name VARCHAR(50),
    customer_email VARCHAR(50))`, (err) => {
        if(err){
            console.log(err)
        }
        else {
            console.log("Database exists or was created.")
        }
    })


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
    },
    deleteAllOrders : () => {
        return new Promise((resolve, reject) => {
            db.run(`DELETE FROM orders`, (err) => {
                if(err){
                    reject(err)
                }
                else {
                    resolve("Successfully deleted all rows from orders")
                }
            })

        })
    },
    getAllOrders : () => {
        return  new Promise((resolve, reject) => {
            db.all(`SELECT rowid AS id, * FROM orders`, (err, rows) => {
                if(err){
                    reject(err)
                }
                else{
                    let orderJSON = rows.map((order) => {
                        return {id: order.id, ingredients: {salad: order.salad, bacon: order.bacon, cheese: order.cheese, meat: order.meat}, price: order.price, customer_name: order.customer_name, customer_email: order.customer_email}
                    })
                    resolve(orderJSON)
                }
            })
        })
    }
}

