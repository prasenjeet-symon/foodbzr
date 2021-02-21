import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { gender } from '@foodbzr/shared/types';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'foodbzr-update-gender',
    templateUrl: './update-gender.component.html',
    styleUrls: ['./update-gender.component.scss'],
})
export class UpdateGenderComponent implements OnInit, OnDestroy {
    /** data */
    @Input() gender: gender;

    constructor(private modal: ModalController) {}

    ngOnDestroy() {}

    ngOnInit() {}

    closeModal(emit_data: boolean) {
        if (emit_data) {
            this.modal.dismiss(this.gender);
        } else {
            this.modal.dismiss();
        }
    }
}
