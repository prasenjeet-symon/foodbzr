import { Component, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
    selector: 'foodbzr-update-commision',
    templateUrl: './update-commission.component.html',
    styleUrls: ['./update-commission.component.scss'],
})
export class UpdateCommisionComponent {
    @Input() prev_commision: number = 0;

    constructor(private popover: PopoverController) {}

    saveData() {
        this.popover.dismiss(this.prev_commision);
    }
}
