import { Component, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
    selector: 'foodbzr-date-range',
    templateUrl: './date-range.component.html',
    styleUrls: ['./date-range.component.scss'],
})
export class DateRangeComponent {
    @Input() start_date: string;
    @Input() end_date: string;

    constructor(private popover: PopoverController) {}

    closePopover() {
        this.popover.dismiss({
            start_date: this.start_date,
            end_date: this.end_date,
        });
    }
}
