import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';

@Component({
    selector: 'foodbzr-kitchen-more-menu',
    templateUrl: './kitchen-more-menu.component.html',
    styleUrls: ['./kitchen-more-menu.component.scss'],
})
export class KitchenMoreMenuComponent {
    constructor(private popover: PopoverController, private router: Router, private ngZone: NgZone) {}

    closeModal() {
        this.popover.dismiss();
    }

    navToFoodCategory() {
        this.closeModal();
        this.ngZone.run(() => {
            this.router.navigate(['tabs', 'tab3', 'food-cat']);
        });
    }

    navToRegionalFoodCat() {
        this.closeModal();
        this.ngZone.run(() => {
            this.router.navigate(['tabs', 'tab3', 'regional-food-cat']);
        });
    }
}
