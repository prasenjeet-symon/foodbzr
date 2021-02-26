import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SearchLocationComponent } from '../choose-location/choose-location.component';

@Component({
    selector: 'foodbzr-ask-location',
    templateUrl: './ask-location.component.html',
    styleUrls: ['./ask-location.component.scss'],
})
export class AskLocationComponent implements OnInit, OnDestroy {
    constructor(private modal: ModalController, private modal_2: ModalController) {}

    ngOnInit() {}

    ngOnDestroy() {}

    /** close modal */
    public closeModal() {
        this.modal.dismiss();
    }

    /** search the location */
    public async searchLocation() {
        const modalRef = await this.modal_2.create({
            component: SearchLocationComponent,
        });
        await modalRef.present();

        const { data } = await modalRef.onWillDismiss();
        console.log(data);
        if (data) {
            /** set the data to localstorage */
            localStorage.setItem('street', data.street);
            localStorage.setItem('city', data.city);
            localStorage.setItem('pincode', data.pincode);
            localStorage.setItem('state', data.state);
            localStorage.setItem('lat', data.lat);
            localStorage.setItem('lng', data.lng);

            this.closeModal();
        }
    }
}
