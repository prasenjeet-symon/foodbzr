import { Component } from '@angular/core';
import { PluginListenerHandle, Plugins } from '@capacitor/core';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Platform, ToastController } from '@ionic/angular';
import { NetworkManager } from '@sculify/node-room-client';
import { Subscription } from 'rxjs';
const { Network } = Plugins;

@Component({
    selector: 'foodbzr-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
})
export class AppComponent {
    private networkHandler: PluginListenerHandle;
    private resume_subs: Subscription;
    private pause_subs: Subscription;

    constructor(private platform: Platform, private splashScreen: SplashScreen, private statusBar: StatusBar, private toast: ToastController) {
        this.initializeApp();
    }

    /** print the message */
    public async printMessage(message: string, color: string) {
        const toastRef = await this.toast.create({
            header: message,
            duration: 4000,
            color: color,
        });

        toastRef.present();
    }

    ngOnDestroy() {
        if (this.networkHandler) {
            this.networkHandler.remove();
        }

        if (this.resume_subs) {
            this.resume_subs.unsubscribe();
        }

        if (this.pause_subs) {
            this.pause_subs.unsubscribe();
        }
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
            /**
             *
             *
             *
             *
             */

            this.resume_subs = this.platform.resume.subscribe(() => {
                if (!NetworkManager.getInstance().isConnected()) {
                    NetworkManager.getInstance().reConnect();
                }
            });

            this.pause_subs = this.platform.pause.subscribe(() => {
                //TODO: need to disconnect the connection for the
            });
            /**
             *
             *
             */
            this.networkHandler = Network.addListener('networkStatusChange', (status) => {
                if (!status.connected) {
                    this.printMessage('Internet disconnected', 'danger');
                } else {
                    this.printMessage('Your are online.', 'success');
                    if (!NetworkManager.getInstance().isConnected()) {
                        NetworkManager.getInstance().reConnect();
                    }
                }
            });
            /**
             *
             *
             *
             */
        });
    }
}
