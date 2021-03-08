import { Component, ElementRef, Input, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { fetch_order_kitchen_report, FoodbzrDatasource } from '@foodbzr/datasource';
import { IGetOrder } from '@foodbzr/shared/types';
import { makeOrderMoneyStackedGraphData } from '@foodbzr/shared/util';
import { Platform, PopoverController } from '@ionic/angular';
import { daoConfig, DaoLife, NetworkManager } from '@sculify/node-room-client';
import { Chart } from 'chart.js';
import * as moment from 'moment';
import { Observable, Subscription } from 'rxjs';
import { LoadingScreenService } from '../../../../loading-screen.service';
import { SumPositiveNumberPipe } from '../../pipes/sum-positive-number.pipe';
import { DateRangeComponent } from '../date-range/date-range.component';

@Component({
    selector: 'foodbzr-money-report',
    templateUrl: './money-report.component.html',
    styleUrls: ['./money-report.component.scss'],
    providers: [SumPositiveNumberPipe],
})
export class MoneyReportComponent implements OnInit, OnDestroy {
    @ViewChild('orderGraph', { static: true }) orderGraph: ElementRef<HTMLDivElement>;
    public daosLife: DaoLife;
    public database = {
        fetch_order_kitchen_report: FoodbzrDatasource.getInstance().fetch_order_kitchen_report,
    };

    /** inputs */
    @Input() kitchen_row_uuid: string;
    @Input() chooseDate: Observable<boolean>;

    /** data */
    public orders: IGetOrder[] = [];
    public partner_row_uuid: string;
    public start_date: string = '2021-01-01';
    public end_date: string = '2021-03-01';
    public labels: string[] = [];
    public total_order_data: number;
    public delivered_data: number[] = [];
    public canceled_data: number[] = [];
    public myChart: Chart;
    public filteredOrders: IGetOrder[] = [];
    public filterType: 'all' | 'delivered' | 'canceled' = 'all';
    public dateChangeObs$: Subscription;

    /** daos */
    fetch_order_kitchen_report__: fetch_order_kitchen_report;

    /** subscriptions */
    public networkSubscription: Subscription;

    constructor(private ngZone: NgZone, private activatedRoute: ActivatedRoute, private popover: PopoverController, private loading: LoadingScreenService, private platform: Platform) {
        this.partner_row_uuid = localStorage.getItem('partner_row_uuid');
        this.daosLife = new DaoLife();
    }

    ngOnInit() {
        this.dateChangeObs$ = this.chooseDate.subscribe((val) => {
            this.chooseDateRange();
        });

        /** add the start date and end date */
        this.end_date = moment(new Date()).format('YYYY-MM-DD');
        this.start_date = moment(new Date()).subtract(3, 'months').format('YYYY-MM-DD');

        this.initScreen();
        this.networkSubscription = NetworkManager.getInstance().reloadCtx.subscribe((val) => {
            if (val) {
                this.daosLife.softKill();
                this.initScreen(false);
            }
        });
    }

    ngOnDestroy() {
        this.daosLife.softKill();
        if (this.dateChangeObs$) {
            this.dateChangeObs$.unsubscribe();
        }
        if (this.networkSubscription) {
            this.networkSubscription.unsubscribe();
        }
    }

    public initScreen(can_show_loading = true) {
        this.platform.ready().then(() => {
            this.fetch_order_kitchen_report__ = new this.database.fetch_order_kitchen_report(daoConfig);
            this.fetch_order_kitchen_report__.observe(this.daosLife).subscribe((val) => {
                this.ngZone.run(() => {
                    this.orders = val;
                    this.filterType = 'all';
                    this.filteredOrders = val;

                    /** render the graph */
                    const data = makeOrderMoneyStackedGraphData(this.start_date, this.end_date, val);
                    this.labels = data.labels;
                    this.delivered_data = data.delivered_orders_counts;
                    this.canceled_data = data.canceled_orders_counts;
                    this.renderGraph();

                    if (this.loading.dailogRef.isConnected) {
                        this.loading.dailogRef.dismiss();
                    }
                });
            });

            if (can_show_loading) {
                this.loading.showLoadingScreen().then(() => {
                    this.fetch_order_kitchen_report__.fetch(this.kitchen_row_uuid, this.start_date, this.end_date).obsData();
                });
            } else {
                this.fetch_order_kitchen_report__.fetch(this.kitchen_row_uuid, this.start_date, this.end_date).obsData();
            }
        });
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
                    {
                        label: 'Canceled',
                        data: this.canceled_data,
                        backgroundColor: '#FAEBCC', // yellow
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
            cssClass: 'popover_width',
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

                this.loading.showLoadingScreen().then(() => {
                    this.fetch_order_kitchen_report__.fetch(this.kitchen_row_uuid, this.start_date, this.end_date).obsData();
                });
            }
        }
    }
}
