const path = require('path');
const express = require('express');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const bodyParser = require("body-parser");
const multer = require('multer');

const app = express();

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

app.use(bodyParser.urlencoded({extended: false}));
app.use(
    multer({ storage: fileStorage }).single('file')
);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/files', express.static(path.join(__dirname, 'files')));

// app.use(bodyParser.json());
// // drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });

app.use(categoryRoute);
app.use(fileRoute);
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

