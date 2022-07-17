const path = require('path');
const express = require('express');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const Category = require('./models/category');
const bodyParser = require("body-parser");

const app = express()

const categoryRoute = require('./routes/categoryRoute');

// parse requests of content-type -
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));


// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true}));

// const db = require("./models");
// db.sequelize.sync()
//     .then(() => {
//         console.log("Synced db.");
//     })
//     .catch((err) => {
//         console.log("Failed to sync db: " + err.message);
//     });

// // drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });

app.use(categoryRoute);
app.use(errorController.get404);

try {
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

sequelize
    // .sync({ force: true })
    .sync()
    .then(cart => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });

