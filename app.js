const path = require('path');
const express = require('express');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const bodyParser = require("body-parser");
const multer = require('multer');
const app = express();
const Permission = require('./models/permission');

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'files');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const categoryRoute = require('./routes/categoryRoute');
const fileRoute = require('./routes/fileRoute');
const authRoute = require('./routes/authRoute');
const companyRoute = require('./routes/companyRoute');
const employeeRoute = require('./routes/employeeRoute');
const invoiceRoute = require('./routes/invoiceRoute');
const invoiceDraftRoute = require('./routes/invoiceDraftRoute');


app.use(bodyParser.urlencoded({extended: false}));
app.use(
    multer({ storage: fileStorage }).single('file')
);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/files', express.static(path.join(__dirname, 'files')));

app.use((req, res, next) => {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    // TODO: factor out all sensitive data to env variables
    // TODO: Env variables can be called with process.env.NAME_OF_VARIABLE
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
    next();
});
app.use(bodyParser.json());

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
        initial()
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


