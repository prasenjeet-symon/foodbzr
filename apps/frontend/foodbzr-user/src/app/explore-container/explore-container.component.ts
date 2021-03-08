import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'foodbzr-explore-container',
    templateUrl: './explore-container.component.html',
    styleUrls: ['./explore-container.component.scss'],
})
export class ExploreContainerComponent implements OnInit {
    @Input() name: string;

    constructor() {}

    ngOnInit() {}
}
