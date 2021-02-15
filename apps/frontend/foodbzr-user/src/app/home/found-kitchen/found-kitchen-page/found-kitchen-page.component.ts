import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'foodbzr-found-kitchen-page',
    templateUrl: './found-kitchen-page.component.html',
    styleUrls: ['./found-kitchen-page.component.scss'],
})
export class FoundKitchenPageComponent implements OnInit {
    menu = new Array(9).fill(null);
    kitchen = new Array(9).fill(null);

    constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

    ngOnInit() {}

    navKitchenPage() {
        const kitchen_row_uuid: string = 'kl';
        const kitchen_profile_picture: string = '';
        this.router.navigate(['kitchen', kitchen_row_uuid, kitchen_profile_picture], { relativeTo: this.activatedRoute });
    }
}
