import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'foodbzr-delivered-success',
    templateUrl: './delivered-success.component.html',
    styleUrls: ['./delivered-success.component.scss'],
})
export class DeliveredSuccessComponent {
    constructor(private modal: ModalController) {}

    /** close modal */
    closeModal() {
        this.modal.dismiss();
    }
}
