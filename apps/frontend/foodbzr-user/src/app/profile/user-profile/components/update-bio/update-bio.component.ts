import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'foodbzr-update-bio',
    templateUrl: './update-bio.component.html',
    styleUrls: ['./update-bio.component.scss'],
})
export class UpdateBioComponent implements OnInit, OnDestroy {
    /** data */
    @Input() bio: string;

    constructor(private modal: ModalController) {}

    ngOnInit() {}

    ngOnDestroy() {}

    closeModal(emit_data: boolean) {
        if (emit_data) {
            this.modal.dismiss(this.bio);
        } else {
            this.modal.dismiss();
        }
    }
}
