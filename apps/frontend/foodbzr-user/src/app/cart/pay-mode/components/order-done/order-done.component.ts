import { Component, Input, OnInit } from '@angular/core';
import { IGetOrder } from '@foodbzr/shared/types';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'foodbzr-order-done',
    templateUrl: './order-done.component.html',
    styleUrls: ['./order-done.component.scss'],
})
export class OrderDoneComponent implements OnInit {
    
    @Input() order: IGetOrder;

    constructor(private modal: ModalController) {}

    ngOnInit() {}

    /** close the modal */
    closeModal() {
        this.modal.dismiss();
    }
}
