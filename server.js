import express from 'express';
import cors from 'cors';
import helloWorldController from './controllers/helloworld-controller.js';
import steamController from './controllers/steam-controller.js';
import mongoose from 'mongoose'


const CONNECTION_STRING = process.env.DB_CONNECTION_STRING;

mongoose.connect(CONNECTION_STRING);
const app = express();
app.use(cors());
helloWorldController(app);
steamController(app);

app.get('/', (req, res) => {res.send('Welcome to the hobo server!')})
app.listen(4000);