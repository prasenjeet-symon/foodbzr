import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
    selector: 'foodbzr-report-page',
    templateUrl: './report-page.component.html',
    styleUrls: ['./report-page.component.scss'],
})
export class ReportPageComponent implements OnInit {
    /** data */
    public kitchen_row_uuid: string;
    public visible_report = 'order_report';
    public chooseSubject = new Subject();

    constructor(private activatedRoute: ActivatedRoute, private ngZone: NgZone) {}

    ngOnInit() {
        /** extract the param */
        this.activatedRoute.paramMap.subscribe((val) => {
            if (val.has('kitchen_row_uuid')) {
                this.kitchen_row_uuid = val.get('kitchen_row_uuid');
            }
        });
    }

    /** choose date range */
    chooseDateRange() {
        this.chooseSubject.next(true);
    }

    public viewChanging(value: string) {
        this.ngZone.run(() => {
            this.visible_report = value;
        });
    }
}
