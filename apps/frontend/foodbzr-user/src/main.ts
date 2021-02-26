import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import { ClientDatabase } from '@sculify/node-room-client';
import { FoodbzrDatasource } from '@foodbzr/datasource';

FoodbzrDatasource.initInstance();

const clientDB = new ClientDatabase(FoodbzrDatasource, 'http://localhost:3333', 'foodbzr_database', '31acb587-9cc0-4338-9cbf-8d898ea50ac5', 'online');

if (environment.production) {
    enableProdMode();
}

clientDB.initInstance().then(() => {
    platformBrowserDynamic()
        .bootstrapModule(AppModule)
        .catch((err) => console.error(err));
});
