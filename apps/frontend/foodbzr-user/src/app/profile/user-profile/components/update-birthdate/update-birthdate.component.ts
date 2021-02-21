import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'foodbzr-update-birthdate',
    templateUrl: './update-birthdate.component.html',
    styleUrls: ['./update-birthdate.component.scss'],
})
export class UpdateBirthdateComponent implements OnInit, OnDestroy {
    /** data */
    @Input() birth_date: string;

    constructor(private modal: ModalController) {}

    ngOnInit() {}

    ngOnDestroy() {}

    closeModal(can_emit_data: boolean) {
        if (can_emit_data) {
            this.modal.dismiss(this.birth_date);
        } else {
            this.modal.dismiss();
        }
    }
}
