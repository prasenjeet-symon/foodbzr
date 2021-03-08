import { Component, OnInit } from '@angular/core';
import { FcmService } from '../../../fcm.service';

@Component({
    selector: 'foodbzr-order-manager-page',
    styleUrls: ['./order-manager-page.component.scss'],
    templateUrl: './order-manager-page.component.html',
})
export class OrderManagerPageComponent implements OnInit {
    constructor(private fcm: FcmService) {
        this.fcm.initPush();
    }

    ngOnInit() {}
}
