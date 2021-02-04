import * as express from 'express';
import { listen } from 'socket.io';
import * as http from 'http';
import * as cors from 'cors';

import { DatabaseWrapper } from '@sculify/node-room';
import { FoodbzrDatasource } from '@foodbzr/datasource';
import { environment } from './environments/environment';
import { add_test_data } from '@foodbzr/test-datasource';

const APP = express();
APP.use(cors());

const SERVER = http.createServer(APP);
const io = listen(SERVER);

const HOST = 'localhost';
const PORT = (process.env.PORT || 3333) as number;

const MYSQL_CONFIG = {
    host: 'localhost',
    password: '',
    user: 'root',
    port: 3306,
};

const foodbzrDatasource = new DatabaseWrapper(MYSQL_CONFIG, FoodbzrDatasource);

// Init school database instance for the testing
foodbzrDatasource.init('test_foodbzr_database').then(() => {
    console.log(foodbzrDatasource.get_instance('test_foodbzr_database'));
    // Add the test data to the instance
    if (!environment.is_test_data_added) {
        add_test_data(MYSQL_CONFIG, 'test_foodbzr_database')
            .then(() => console.info('added test data'))
            .catch((err) => console.error(err));
    }
});

// Listen for any connection for the school database instances
io.sockets.on('connection', (socket) => foodbzrDatasource.incomingConnection(socket));

SERVER.listen(+PORT, HOST, 1000, () => console.log(`running on http://${HOST}:${PORT}`));
SERVER.on('error', console.error);
