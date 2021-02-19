import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'foodbzr-found-kitchen-menu',
    templateUrl: './found-kitchen-menu-page.component.html',
    styleUrls: ['./found-kitchen-menu-page.component.scss'],
})
export class FoundKitchenMenuPageComponent implements OnInit {
    found_kitchens = new Array(10).fill(null);

    constructor(private ngZone: NgZone, private activatedRoute: ActivatedRoute, private router: Router) {}

    ngOnInit() {}
}
