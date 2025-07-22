const express = require('express');
const connectMongoDB = require('./connection/connect');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});