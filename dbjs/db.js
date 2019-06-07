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
    })
db.run(`CREATE TABLE IF NOT EXISTS ingredients(
    name varchar(10)
)`, err => err ? console.log(err) : null)

db.run(`CREATE TABLE IF NOT EXISTS users(
    username VARCHAR(32),
    email VARCHAR(50),
    password VARCHAR(16)
)`)


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
            db.all(`SELECT name from ingredients`, [], (err, rows) => {
                if(err) {
                    reject(err)
                }
                else {
                    let ingredientObject = {}
                    rows.forEach(ing => {
                        ingredientObject[ing.name] = 0
                    })
                    resolve(ingredientObject)
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
    },
    userExists: (email, password) => {
        return new Promise((resolve, reject) => {
            db.all(`SELECT rowid AS id, * FROM users WHERE email = ? AND password = ?`, [email, password], (err, rows) => {
                if(err || rows.length === 0){
                    reject({error: "Invalid email and password combination."})
                }
                else {
                    resolve(rows[0])
                }
            })
        })
    },
    insertUser: (username, email, password) => {
        return new Promise((resolve, reject) => {
            //change to email taken later on
            module.exports.userExists(email, password)
            .then(user => {
                if(user){
                    reject({error: "Email in use."})
                }
                else {
                    db.run(`INSERT INTO users(username, email, password) VALUES (?, ?, ?)`, [username, email, password], err => {
                        if(err){
                            console.log('error in db run', err);
                            reject(err)
                        }
                        else{
                            resolve('success')
                        }
                    })
                }
            })
        })
    }
}
// db.run(`INSERT INTO users(username, email, password) VALUES (?, ?, ?)`, ['ben3j', 'ben@yahoo.com', 'mamabicho'])