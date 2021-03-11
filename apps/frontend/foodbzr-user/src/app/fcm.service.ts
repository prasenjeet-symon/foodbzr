import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Capacitor, Plugins, PushNotification, PushNotificationActionPerformed, PushNotificationToken } from '@capacitor/core';
import { FoodbzrDatasource } from '@foodbzr/datasource';
import { PUSH_MESSAGE_TYPE } from '@foodbzr/shared/types';
import { Platform, ToastController } from '@ionic/angular';
import { daoConfig, DaoLife } from '@sculify/node-room-client';
const { PushNotifications } = Plugins;

@Injectable({
    providedIn: 'root',
})
export class FcmService {
    /** database */
    private database = {
        insert_push_message: FoodbzrDatasource.getInstance().insert_push_message,
    };

    /** data */
    private entity_row_uuid: string;

    constructor(private router: Router, private toast: ToastController, private platform: Platform) {
        this.entity_row_uuid = localStorage.getItem('user_row_uuid');
    }

    private async showMessage(message: string) {
        const dailogRef = await this.toast.create({
            header: message,
            duration: 500,
        });
        await dailogRef.present();
    }

    initPush() {
        if (Capacitor.platform !== 'web') {
            this.registerPush();
        } else {
            this.showMessage('can not register push message on the web');
        }
    }

    private registerPush() {
        PushNotifications.requestPermission().then((permission) => {
            if (permission.granted) {
                // Register with Apple / Google to receive push via APNS/FCM
                PushNotifications.register();
            } else {
                this.showMessage('Push notification prmission denied');
                // No permission for push granted
            }
        });

        PushNotifications.addListener('registration', (token: PushNotificationToken) => {
            /** save this to cloud */
            this.saveToDB(JSON.stringify(token));
        });

        PushNotifications.addListener('registrationError', (error: any) => {});
        PushNotifications.addListener('pushNotificationReceived', async (notification: PushNotification) => {
            this.handleRouting(notification);
        });
        PushNotifications.addListener('pushNotificationActionPerformed', async (notification: PushNotificationActionPerformed) => {});
    }

    /** save the push message id to server */
    private saveToDB(key: string) {
        this.platform.ready().then(async () => {
            const daoLife = new DaoLife();
            const insert_push_message__ = new this.database.insert_push_message(daoConfig);
            insert_push_message__.observe(daoLife).subscribe((val) => {
                console.log('inserted the FCM key');
            });

            (await insert_push_message__.fetch('user', this.entity_row_uuid, key)).obsData();
            daoLife.softKill();
        });
    }

    /** handle routing */
    public handleRouting(routingData: PushNotification) {
        if (
            routingData.data.type === PUSH_MESSAGE_TYPE.new_order ||
            routingData.data.type === PUSH_MESSAGE_TYPE.order_canceled ||
            routingData.data.type === PUSH_MESSAGE_TYPE.order_confirmed ||
            routingData.data.type === PUSH_MESSAGE_TYPE.order_cooking ||
            routingData.data.type === PUSH_MESSAGE_TYPE.order_delivered ||
            routingData.data.type === PUSH_MESSAGE_TYPE.order_pickedup
        ) {
            this.router.navigate(['tabs', 'tab3', 'details', routingData.data.order_row_uuid]);
        }
    }
}
