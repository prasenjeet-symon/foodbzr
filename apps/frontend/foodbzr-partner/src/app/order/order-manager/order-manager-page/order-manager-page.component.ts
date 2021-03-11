import { Component, NgZone, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { FcmService } from '../../../fcm.service';

@Component({
    selector: 'foodbzr-order-manager-page',
    styleUrls: ['./order-manager-page.component.scss'],
    templateUrl: './order-manager-page.component.html',
})
export class OrderManagerPageComponent implements OnInit {
    public visible_table = 'pending';

    constructor(private fcm: FcmService, private ngZone: NgZone, private platform: Platform) {
        this.fcm.initPush();
    }

    ngOnInit() {}

    async segmentChanged(ev: any) {
        this.platform.ready().then(() => {
            this.ngZone.run(() => {
                this.visible_table = ev.detail.value;
            });
        });
    }
}
