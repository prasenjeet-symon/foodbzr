import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { fetch_order_dboy_report, FoodbzrDatasource } from '@foodbzr/datasource';
import { IGetOrder } from '@foodbzr/shared/types';
import { makeOrderStackedGraphData } from '@foodbzr/shared/util';
import { Platform, PopoverController } from '@ionic/angular';
import { daoConfig, DaoLife, NetworkManager } from '@sculify/node-room-client';
import { Chart } from 'chart.js';
import * as moment from 'moment';
import { LoadingScreenService } from '../../../loading-screen.service';
import { DateRangeComponent } from '../components/date-range/date-range.component';

@Component({
    selector: 'foodbzr-order-report-page',
    templateUrl: './order-report-page.component.html',
    styleUrls: ['./order-report-page.component.scss'],
})
export class OrderReportPageComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('orderGraph', { static: true }) orderGraph: ElementRef<HTMLDivElement>;

    /** data */
    public database = {
        fetch_order_dboy_report: FoodbzrDatasource.getInstance().fetch_order_dboy_report,
    };
    public daosLife: DaoLife;
    public orders: IGetOrder[] = [];
    public dboy_row_uuid: string;
    public start_date: string = '2021-01-01';
    public end_date: string = '2021-03-01';
    public labels: string[] = [];
    public delivered_data: number[] = [];
    public canceled_data: number[] = [];
    public myChart: Chart;
    public filteredOrders: IGetOrder[] = [];
    public filterType: 'all' | 'delivered' | 'canceled' = 'all';

    /** daos */
    fetch_order_dboy_report__: fetch_order_dboy_report;

    /** subscriptions */
    public networkSubscription: any;

    constructor(private ngZone: NgZone, private popover: PopoverController, private platform: Platform, private loading: LoadingScreenService) {
        this.daosLife = new DaoLife();
        this.dboy_row_uuid = localStorage.getItem('dboy_row_uuid');
        /** add the start date and end date */
        this.end_date = moment(new Date()).format('YYYY-MM-DD');
        this.start_date = moment(new Date()).clone().subtract(3, 'months').format('YYYY-MM-DD');
    }

    ngAfterViewInit() {}

    ngOnDestroy() {
        if (this.networkSubscription) {
            this.networkSubscription.unsubscribe();
        }
        this.daosLife.softKill();
    }

    ngOnInit() {
        this.initScreen();
        this.networkSubscription = NetworkManager.getInstance().reloadCtx.subscribe((val) => {
            if (val) {
                this.initScreen(false);
            }
        });
    }

    public initScreen(can_show_loading = true) {
        this.platform.ready().then(() => {
            this.fetch_order_dboy_report__ = new this.database.fetch_order_dboy_report(daoConfig);
            this.fetch_order_dboy_report__.observe(this.daosLife).subscribe((val) => {
                if (this.loading.dailogRef.isConnected) {
                    this.loading.dailogRef.dismiss();
                }

                this.ngZone.run(() => {
                    this.orders = val;
                    this.filterType = 'all';
                    this.filteredOrders = val;

                    /** render the graph */
                    const data = makeOrderStackedGraphData(this.start_date, this.end_date, val);
                    this.labels = data.labels;
                    this.delivered_data = data.delivered_orders_counts;
                    this.canceled_data = data.canceled_orders_counts;
                    this.renderGraph();
                });
            });

            if (can_show_loading) {
                this.loading.showLoadingScreen().then(() => {
                    this.fetch_order_dboy_report__.fetch(this.dboy_row_uuid, this.start_date, this.end_date).obsData();
                });
            } else {
                this.fetch_order_dboy_report__.fetch(this.dboy_row_uuid, this.start_date, this.end_date).obsData();
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

                this.loading.showLoadingScreen().then(() => {
                    this.fetch_order_dboy_report__.fetch(this.dboy_row_uuid, this.start_date, this.end_date).obsData();
                });
            }
        }
    }
}
