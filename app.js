require('dotenv').config();
const path = require('path');
const express = require('express');
const sequelize = require('./util/database');
const bodyParser = require("body-parser");
const multer = require('multer');
const app = express();
const Permission = require('./models/permission');
const cors = require('cors');


const categoryRoute = require('./routes/categoryRoute');
const fileRoute = require('./routes/fileRoute');
const authRoute = require('./routes/authRoute');
const companyRoute = require('./routes/companyRoute');
const employeeRoute = require('./routes/employeeRoute');
const invoiceRoute = require('./routes/invoiceRoute');
const invoiceDraftRoute = require('./routes/invoiceDraftRoute');
const csvRoute = require('./routes/csvRoute');

// Parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: false }));
// Parse JSON bodies
app.use(bodyParser.json());

app.use(cors({
    origin: 'http://localhost:3001'
}));

function initial() {
    Permission.create({
        id: 1,
        name: "all_invoices_access"
    });
    Permission.create({
        id: 2,
        name: "category_management"
    });
    Permission.create({
        id: 3,
        name: "products_management"
    });
}
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
        // initial()
    })
    .catch(err => {
        console.log(err);
    });


app.use(employeeRoute);
app.use(companyRoute);
app.use(categoryRoute);
app.use(fileRoute);
app.use(authRoute);
app.use(invoiceRoute);
app.use(invoiceDraftRoute);
app.use(csvRoute);