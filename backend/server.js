// const express = require('express');
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

console.log('MONGODB_URI -', process.env.MONGO_URI);

const app = express();

app.get('/', (req, res) => {
    res.send('Server is ready');
});

app.listen(5000, () => {
    console.log('Server started at http://localhost:5000')
})