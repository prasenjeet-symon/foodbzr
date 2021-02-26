import { Component, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
    selector: 'foodbzr-partner-report-page',
    templateUrl: './partner-report-page.component.html',
    styleUrls: ['./partner-report-page.component.scss'],
})
export class PartnerReportPageComponent {
    /** data */
    public partner_row_uuid: string;
    public commission: number;
    public visible_report = 'order_report';
    public chooseSubject = new Subject();

    constructor(private activatedRoute: ActivatedRoute, private ngZone: NgZone) {}

    ngOnInit() {
        /** extract the param */
        this.activatedRoute.paramMap.subscribe((val) => {
            if (val.has('partner_row_uuid') && val.has('commission')) {
                this.partner_row_uuid = val.get('partner_row_uuid');
                this.commission = +val.get('commission');
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
