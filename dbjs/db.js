const pgp = require('pg-promise')()
const functions = require('../functions')

const cn= {
    host: 'localhost',
    port: 5432,
    database: 'burger',
    user: '',
    password: ''
}
var db = pgp(cn)

db.none(`
    CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    email VARCHAR(50),
    password TEXT
)`)
.then(() => {
    db.none(`
        CREATE TABLE IF NOT EXISTS ingredients(
            name varchar(10)
    )`)
    .then(() => {
        db.none(`INSERT INTO ingredients(name) VALUES ($1), ($2), ($3), ($4)`, ['salad', 'bacon', 'cheese', 'meat'])
        .then(() => {})
        .catch(error => console.log(error))
    })
    db.none(`
        CREATE TABLE IF NOT EXISTS orders(
        id SERIAL PRIMARY KEY,
        salad INT,
        bacon INT,
        cheese INT,
        meat INT,
        price FLOAT(2),
        customer_name VARCHAR(50),
        customer_email VARCHAR(50),
        customer_id INT NOT NULL REFERENCES users(id)
    )`)
})




module.exports = {
    insertOrder : (orderJSON) => {
        let orderArray = [];
        functions.flattenObjectToArray(orderJSON, orderArray)
        return new Promise((resolve, reject) => {
            db.none(`INSERT INTO orders(salad, bacon, cheese, meat, price, customer_name, customer_email, customer_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8)`, orderArray)
            .then(resolve("Insert successfull"))
            .catch(error => reject(error))
        })
    },
    getIngredients : () => {
        return new Promise((resolve, reject) => {
            db.any(`SELECT name from ingredients`)
            .then((rows) => {
                let ingredientObject = {}
                    rows.forEach(ing => {
                        ingredientObject[ing.name] = 0
                    })
                    resolve(ingredientObject)
            })
            .catch(error => reject(error))
        })
    },
    getUserCredentials: (email) => {
        return new Promise((resolve, reject) => {
            db.any(`SELECT * FROM users WHERE email = $1`, email)
            .then(rows => {
                if(rows.length == 0){
                    reject({error: "Invalid email and password combination."})
                }
                else {
                    resolve(rows[0])
                }
                
            })
            .catch(() => reject({error: "Invalid email and password combination."}))
        })
    },
    insertUser: (email, password) => {
        return new Promise((resolve, reject) => {
            db.none(`INSERT INTO users(email, password) VALUES ($1, $2)`, [email, password])
            .then(() => {
                db.one(`SELECT * FROM users WHERE email = $1 AND password = $2`, [email, password])
                .then(row => resolve(row))
                .catch(error => reject(error))
            })
            .catch(error => reject(error))
        })
    },
    getOrdersByUserId: (userId) => {
        return new Promise((resolve, reject) => {
            db.any(`SELECT  * FROM orders WHERE customer_id = $1`, userId)
            .then(rows => {
                let orders = rows.map(row => {
                    return {
                        id: row.id,
                        ingredients: {
                            salad: row.salad,
                            bacon: row.bacon,
                            cheese: row.cheese,
                            meat: row.meat
                        },
                        price: row.price
                    }
                })
                resolve(orders)
            })
            .catch(error => reject({error: error}))
        })
    }
}

