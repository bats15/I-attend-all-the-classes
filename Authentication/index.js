require('dotenv').config();
const express = require('express');
const connectMongoDB = require('./connection/connect');
const userRoutes = require('../Authentication/routes/user');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const cookieParser = require('cookie-parser');

const staticRoutes = require('../Authentication/routes/Staticroute')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views',path.resolve('../Authentication/views'));

connectMongoDB(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
    });


    app.use('/user', userRoutes);
    app.use('/', staticRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});