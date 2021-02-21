import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'foodbzr-update-name',
    templateUrl: './update-name.component.html',
    styleUrls: ['./update-name.component.scss'],
})
export class UpdateNameComponent implements OnInit, OnDestroy {
    @Input() full_name: string;

    constructor(private modal: ModalController) {}

    ngOnInit() {}

    ngOnDestroy() {}

    closeModal(emit_data: boolean) {
        if (emit_data) {
            this.modal.dismiss(this.full_name);
        } else {
            this.modal.dismiss();
        }
    }
}
