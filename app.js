require('dotenv').config();
const path = require('path');
const express = require('express');
const sequelize = require('./util/database');
const bodyParser = require("body-parser");
const multer = require('multer');
const app = express();
const Permission = require('./models/permission');
const cors = require('cors');
const cron = require('node-cron');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const Invitation = require('./models/invitation');

const categoryRoute = require('./routes/categoryRoute');
const fileRoute = require('./routes/fileRoute');
const authRoute = require('./routes/authRoute');
const companyRoute = require('./routes/companyRoute');
const employeeRoute = require('./routes/employeeRoute');
const invoiceRoute = require('./routes/invoiceRoute');
const csvRoute = require('./routes/csvRoute');
const productRoute = require('./routes/productsRoute');
const customerRoute = require('./routes/customerRoute');
const errorHandler = require('./middleware/errorHandler');


// Parse URL-encoded bodies
app.use(bodyParser.urlencoded({extended: false}));
// Parse JSON bodies
app.use(bodyParser.json());

app.use(cors({
    origin: process.env.FRONTEND_ORIGIN
}));

async function initial() {
    await Permission.create({
        id: 1, name: "all_invoices_access"
    });
    await Permission.create({
        id: 2, name: "category_management"
    });
    await Permission.create({
        id: 3, name: "products_management"
    });
    await Permission.create({
        id: 4, name: "admin"
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
        app.listen(process.env.PORT || 3000);
        // initial()
        function deleteExpiredTokens() {
            let EXPIRATION_TIME = 86400000; // 24 hours in milliseconds
            const expirationDate = new Date(Date.now() - EXPIRATION_TIME);
            Invitation.destroy({
                where: {
                    createdAt: {
                        [Op.lt]: expirationDate
                    }
                }
            })
                .then(() => {
                    console.log('Expired tokens deleted');
                })
                .catch(err => {
                    console.error('Error deleting tokens', err);
                });
        }

        // Then schedule the job to run every hour
        cron.schedule('0 * * * *', deleteExpiredTokens);
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
app.use(csvRoute);
app.use(productRoute);
app.use(customerRoute);

app.use(errorHandler);