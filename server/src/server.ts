import bodyParser from 'body-parser';
import express, { NextFunction, Request, Response } from 'express';
import firebaseAdmin from 'firebase-admin';
import http from 'http';
import mongoose from 'mongoose';
import config from './config/config';
import logging from './config/logging';

import blogRoutes from './routes/blog';
import userRoutes from './routes/user';

const router = express();

/** Server Handling */
const httpServer = http.createServer(router);

/** Connect to Firebase */
let serviceAccount = require('./config/serviceAccount.json');

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount)
});

/** Connect to Mongo */
mongoose
    .connect(config.mongo.url, config.mongo.options)
    .then((result) => {
        logging.info('Mongo Connected');
    })
    .catch((error) => {
        logging.error(error);
    });

/** Log the request */
router.use((req : Request, res: Response, next: NextFunction) => {
    logging.info(`METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

    res.on('finish', () => {
        logging.info(`METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`);
    });

    next();
});

/** Parse the body of the request */
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

/** Rules of our API */
router.use((req : Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }

    next();
});

/** Routes */
router.use('/users', userRoutes);
router.use('/blogs', blogRoutes);

/** Error handling */
router.use((req : Request, res: Response, next: NextFunction) => {
    const error = new Error('Not found');

    res.status(404).json({
        message: error.message
    });
});

/** Listen */
httpServer.listen(config.server.port, () => logging.info(`Server is running ${config.server.host}:${config.server.port}`));