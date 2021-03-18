import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { FoodbzrDatasource } from '@foodbzr/datasource';
import { ClientDatabase, NetworkManager } from '@sculify/node-room-client';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

const server_domain_name = 'https://foodbzr.xyz/';
const server_instance_uuid = 'c0ac4436-5a27-4aef-bd4d-e5df51c05fcb';

const local_domain_name = 'http://localhost:3333';
const local_instance_uuid = '769992f8-2977-4b18-99ec-312fd04bcb52';

FoodbzrDatasource.initInstance();
const clientDB = new ClientDatabase(FoodbzrDatasource, local_domain_name, 'foodbzr_database', local_instance_uuid, 'online');
NetworkManager.initInstance(clientDB);

if (environment.production) {
    enableProdMode();
}

clientDB.initInstance().then(() => {
    platformBrowserDynamic()
        .bootstrapModule(AppModule)
        .catch((err) => console.error(err));
});
