import * as express from 'express';
import { listen } from 'socket.io';
import * as http from 'http';
import * as cors from 'cors';

import { DatabaseWrapper, MYSQLManager } from '@sculify/node-room';
import { FoodbzrDatasource } from '@foodbzr/datasource';
import { add_test_data } from '@foodbzr/test-datasource';
import * as mysql from 'mysql';

const APP = express();
APP.use(cors());

MYSQLManager.initInstance(mysql);

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
    if (process.env.CAN_ADD_TEST_DATA) {
        add_test_data(MYSQL_CONFIG, 'test_foodbzr_database')
            .then(() => console.info('generated test data'))
            .catch((err) => console.error(err));
    }
});

// Listen for any connection for the school database instances

io.sockets.on('connection', (socket) => foodbzrDatasource.incomingConnection(socket));

SERVER.listen(PORT, HOST, 1000, () => console.log(`running on http://${HOST}:${PORT}`));
SERVER.on('error', console.error);
