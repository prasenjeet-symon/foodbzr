import { FoodbzrDatasource } from '@foodbzr/datasource';
import { add_test_data } from '@foodbzr/test-datasource';
import { DatabaseWrapper, MYSQLManager, NodeJsModules } from '@sculify/node-room';
import * as cors from 'cors';
import * as express from 'express';
import { Request, Response } from 'express';
import * as http from 'http';
import * as makeDir from 'make-dir';
import * as multer from 'multer';
import * as mysql from 'mysql';
import * as pathe from 'path';
import { listen } from 'socket.io';
import * as Twilio from 'twilio';
import { v4 as uuid } from 'uuid';
require('dotenv').config();
const serviceAccount = require('../foodbzr-firebase-adminsdk-6fidb-fbc5c4382d.json');
const admin = require('firebase-admin');

const APP = express();
APP.use(cors());

const static_path = pathe.join(__dirname, '../', 'storage');
APP.use(express.static(static_path));

APP.get('/home', async (req, res) => {
    res.send('Server works!');
});

/**
 * file upload cloud
 */
const PROFILE_PIC_DIR_NAME = 'media/profile_pictures';
const MENU_PIC_DIR_NAME = 'media/menu_pictures';

const profile_picture_cloud = multer.diskStorage({
    destination: (req: any, file: Express.Multer.File, cb) => {
        makeDir(pathe.join(__dirname, '../', 'storage', PROFILE_PIC_DIR_NAME)).then((path: string) => {
            cb(null, path);
        });
    },
    filename: (req, file, cb) => {
        cb(null, `${uuid()}_profile_picture_${file.originalname}`);
    },
});

const uplaod_profile_picture = multer({ storage: profile_picture_cloud });

APP.post('/upload_profile_picture', uplaod_profile_picture.single('avatar'), (req: Request, res: Response) => {
    const file_info = req.file;
    console.log(file_info);
    res.json({
        MimeType: file_info.mimetype,
        size: file_info.size,
        pic_uri: `${PROFILE_PIC_DIR_NAME}/${uuid()}_profile_picture_${file_info.originalname}`,
        thumbnail_uri: `${PROFILE_PIC_DIR_NAME}/${uuid()}_profile_picture_${file_info.originalname}`,
    });
});

/**
 *
 *
 */
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
});

MYSQLManager.initInstance(mysql);
NodeJsModules.initInstance({
    Twilio: Twilio,
    FirebaseAdmin: admin,
});

const SERVER = http.createServer(APP);
const io = listen(SERVER);

const HOST = process.env.HOST ? process.env.HOST : 'localhost';
const PORT = (process.env.PORT || 3333) as number;

const MYSQL_CONFIG = {
    host: process.env.DB_HOST ? process.env.DB_HOST : 'localhost',
    password: process.env.DB_PASSWORD ? process.env.DB_PASSWORD : '',
    user: process.env.DB_USER ? process.env.DB_USER : 'root',
    port: process.env.DB_PORT ? +process.env.DB_PORT : 3306,
};

const foodbzrDatasource = new DatabaseWrapper(MYSQL_CONFIG, FoodbzrDatasource);

// Init school database instance for the testing
foodbzrDatasource.init('test_foodbzr_database').then(() => {
    console.log(foodbzrDatasource.get_instance('test_foodbzr_database'));
    // Add the test data to the instance
    if (process.env.CAN_ADD_TEST_DATA === 'yes') {
        add_test_data(MYSQL_CONFIG, 'test_foodbzr_database')
            .then(() => console.info('generated test data'))
            .catch((err) => console.error(err));
    }
});

// Listen for any connection for the school database instances
io.sockets.on('connection', (socket) => foodbzrDatasource.incomingConnection(socket));

SERVER.listen(PORT, HOST, 1000, () => console.log(`running on http://${HOST}:${PORT}`));
SERVER.on('error', console.error);
