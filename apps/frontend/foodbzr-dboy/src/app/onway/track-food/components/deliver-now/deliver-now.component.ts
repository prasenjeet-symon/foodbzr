import { Component, NgZone } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'foodbzr-deliver-now',
    templateUrl: './deliver-now.component.html',
    styleUrls: ['./deliver-now.component.scss'],
})
export class DeliverNowComponent {
    /** data */
    public OTP: number;

    constructor(private modal: ModalController, private ngZone: NgZone) {}

    /** close the modal */
    public closeModal(emit_data: boolean) {
        if (emit_data) {
            this.modal.dismiss(this.OTP);
        } else {
            this.modal.dismiss();
        }
    }
}
