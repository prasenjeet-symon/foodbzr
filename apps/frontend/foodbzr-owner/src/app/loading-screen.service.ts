import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({ providedIn: 'root' })
export class LoadingScreenService {
    public dailogRef: HTMLIonLoadingElement;

    constructor(private loadingCtrl: LoadingController) {}

    public async showLoadingScreen() {
        const ref = await this.loadingCtrl.create({
            message: 'loading...',
        });

        await ref.present();
        this.dailogRef = ref;

        return ref;
    }
}
