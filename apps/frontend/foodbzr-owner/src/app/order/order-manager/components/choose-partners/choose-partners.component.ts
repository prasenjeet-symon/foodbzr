import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { IGetPartner } from '@foodbzr/shared/types';
import { PopoverController } from '@ionic/angular';

@Component({
    selector: 'foodbzr-choose-partners',
    templateUrl: './choose-partners.component.html',
    styleUrls: ['./choose-partners.component.scss'],
})
export class ChoosePartnersComponent implements OnInit, OnDestroy {
    @Input() partners: IGetPartner[] = [];
    @Input() selectedPartners: IGetPartner[] = [];

    constructor(private pop: PopoverController) {}

    ngOnInit() {}
    ngOnDestroy() {}

    dismissModel() {
        this.pop.dismiss(this.selectedPartners);
    }
}
