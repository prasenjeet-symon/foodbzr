import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'foodbzr-cooking-instruction',
    templateUrl: './cooking-instruction.component.html',
    styleUrls: ['./cooking-instruction.component.scss'],
})
export class CookingInstructionComponent implements OnInit {
    /** data */
    @Input() instruction: string = '';

    constructor(private modal: ModalController) {}

    ngOnInit() {}

    closeModal() {
        this.modal.dismiss();
    }

    saveInstruction() {
        this.modal.dismiss(this.instruction);
    }
}
