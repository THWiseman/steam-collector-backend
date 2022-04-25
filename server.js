import cors from 'cors';
import steamController from './controllers/steam-controller.js';
import userController from './controllers/user-controller.js';
import collectionController from './controllers/collection-controller.js'
import mongoose from 'mongoose'
import express from 'express'
import session from 'express-session'
import MongoStore from 'connect-mongo'

const CONNECTION_STRING = process.env.DB_CONNECTION_STRING;

mongoose.connect(CONNECTION_STRING);
const app = express();
app.use(express.json());
app.use(cors({
    credentials : true,
    origin: 'http://localhost:3000'
}));
app.use(session(
    {
        secret: 'SECRET KEY',
        resave: false,
        saveUninitialized: true,
        store: new MongoStore({
            mongoUrl: CONNECTION_STRING,
            ttl: 14 * 24 * 60 * 60,
            autoRemove: 'native'
        })
    }
))

userController(app);
steamController(app);
collectionController(app);

app.get('/', (req, res) => {res.send('Welcome to the Steam Collector!')});
app.listen(4000);