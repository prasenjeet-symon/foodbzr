import { Component, ElementRef, Input, NgZone, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FoodbzrDatasource, fetch_order_partner_report } from '@foodbzr/datasource';
import { IGetOrder } from '@foodbzr/shared/types';
import { makeOrderCommisionStackedGraphData } from '@foodbzr/shared/util';
import { PopoverController } from '@ionic/angular';
import { DaoLife } from '@sculify/node-room-client';
import { Observable, Subscription } from 'rxjs';

import { DateRangeComponent } from '../date-range/date-range.component';
import * as moment from 'moment';
import { Chart } from 'chart.js';
import { daoConfig } from '@sculify/node-room-client';

@Component({
    selector: 'foodbzr-commision-report',
    templateUrl: './commission-report.component.html',
    styleUrls: ['./commission-report.component.scss'],
})
export class CommissionReportComponent {
    @ViewChild('orderGraph', { static: true }) orderGraph: ElementRef<HTMLDivElement>;
    public daosLife: DaoLife;
    public database = {
        fetch_order_partner_report: FoodbzrDatasource.getInstance().fetch_order_partner_report,
    };

    /** inputs */
    @Input() partner_row_uuid: string;
    @Input() commission: number;
    @Input() chooseDate: Observable<boolean>;

    /** data */
    public orders: IGetOrder[] = [];
    public start_date: string = '2021-01-01';
    public end_date: string = '2021-03-01';
    public labels: string[] = [];
    public delivered_data: number[] = [];
    public myChart: Chart;
    public filteredOrders: IGetOrder[] = [];
    public filterType: 'all' | 'delivered' | 'canceled' = 'all';
    public dateChangeObserver$: Subscription;

    /** daos */
    fetch_order_partner_report__: fetch_order_partner_report;

    constructor(private ngZone: NgZone, private activatedRoute: ActivatedRoute, private popover: PopoverController) {
        this.daosLife = new DaoLife();
        /** add the start date and end date */
        this.end_date = moment(new Date()).format('YYYY-MM-DD');
        this.start_date = moment(new Date()).clone().subtract(3, 'months').format('YYYY-MM-DD');
    }

    ngOnInit() {
        this.dateChangeObserver$ = this.chooseDate.subscribe((val) => {
            this.chooseDateRange();
        });

        this.fetch_order_partner_report__ = new this.database.fetch_order_partner_report(daoConfig);
        this.fetch_order_partner_report__.observe(this.daosLife).subscribe((val) => {
            this.ngZone.run(() => {
                this.orders = val;
                this.filterType = 'all';
                this.filteredOrders = val;

                /** render the graph */
                const data = makeOrderCommisionStackedGraphData(this.start_date, this.end_date, val, this.commission);
                this.labels = data.labels;
                this.delivered_data = data.delivered_orders_counts;
                this.renderGraph();
            });
        });
        this.fetch_order_partner_report__.fetch(this.partner_row_uuid, this.start_date, this.end_date).obsData();
    }

    /** render the graph  */
    renderGraph() {
        this.myChart = new Chart(this.orderGraph.nativeElement as any, {
            type: 'bar',
            data: {
                labels: this.labels,
                datasets: [
                    {
                        label: 'Delivered',
                        data: this.delivered_data,
                        backgroundColor: '#D6E9C6', // green
                    },
                ],
            },
            options: {
                scales: {
                    xAxes: [{ stacked: true }],
                    yAxes: [{ stacked: true }],
                },
            },
        });
    }

    /** filter type is changing , change the data  */
    public filterTypeChange() {
        if (this.filterType === 'all') {
            this.filteredOrders = this.orders.slice(0);
        } else if (this.filterType === 'canceled') {
            this.filteredOrders = this.orders.filter((p) => p.delivery_status === 'canceled');
        } else {
            this.filteredOrders = this.orders.filter((p) => p.delivery_status === 'delivered');
        }
    }

    /** choose the date range, show the popover to select the date range , then update the data */
    public async chooseDateRange() {
        const popRef = await this.popover.create({
            component: DateRangeComponent,
            translucent: true,
            cssClass: 'popover_with',
            componentProps: {
                start_date: this.start_date,
                end_date: this.end_date,
            },
        });

        await popRef.present();

        const { data } = await popRef.onWillDismiss();

        if (data) {
            const start_date = data.start_date;
            const end_date = data.end_date;

            if (start_date && end_date) {
                /** fetch the new result based on the date range */
                const final_sql_start_date = moment(new Date(start_date)).format('YYYY-MM-DD');
                const final_sql_end_date = moment(new Date(end_date)).format('YYYY-MM-DD');

                this.start_date = final_sql_start_date;
                this.end_date = final_sql_end_date;

                this.fetch_order_partner_report__.fetch(this.partner_row_uuid, this.start_date, this.end_date).obsData();
            }
        }
    }

    ngOnDestroy() {
        this.daosLife.softKill();
        if (this.dateChangeObserver$) {
            this.dateChangeObserver$.unsubscribe();
        }
    }
}
