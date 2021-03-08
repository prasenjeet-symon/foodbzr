import { Component, OnDestroy, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
    selector: 'foodbzr-init-dboy',
    templateUrl: './init-dboy.component.html',
    styleUrls: ['./init-dboy.component.scss'],
})
export class InitDboyComponent implements OnInit, OnDestroy {
    constructor(private pop: PopoverController) {}

    public mobile_number: string;
    public full_name: string;

    ngOnInit() {}
    ngOnDestroy() {}

    closeModal() {
        this.pop.dismiss({ mobile_number: this.mobile_number, full_name: this.full_name });
    }
}
