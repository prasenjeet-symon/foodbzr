import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import { ClientDatabase, NetworkManager } from '@sculify/node-room-client';
import { FoodbzrDatasource } from '@foodbzr/datasource';

FoodbzrDatasource.initInstance();
const clientDB = new ClientDatabase(FoodbzrDatasource, 'https://sculifyface.xyz/', 'foodbzr_database', '9962ded9-ca85-4d15-a2f6-ac17f553381b', 'online');
NetworkManager.initInstance(clientDB);

if (environment.production) {
    enableProdMode();
}

clientDB.initInstance().then(() => {
    platformBrowserDynamic()
        .bootstrapModule(AppModule)
        .catch((err) => console.error(err));
});
