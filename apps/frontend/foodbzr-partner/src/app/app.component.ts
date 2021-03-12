import { Component, OnDestroy, OnInit } from '@angular/core';
import { PluginListenerHandle, Plugins } from '@capacitor/core';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Platform, ToastController } from '@ionic/angular';
import { NetworkManager } from '@sculify/node-room-client';
const { Network } = Plugins;

@Component({
    selector: 'foodbzr-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnDestroy, OnInit {
    private networkHandler: PluginListenerHandle;
    private resume_subs: any;
    private pause_subs: any;

    constructor(private platform: Platform, private splashScreen: SplashScreen, private statusBar: StatusBar, private toast: ToastController) {
        this.initializeApp();
    }

    ngOnInit() {}

    /** print the message */
    public async printMessage(message: string, color: string) {
        const toastRef = await this.toast.create({
            header: message,
            duration: 4000,
            color: color,
        });

        await toastRef.present();
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
        if (this.networkHandler) {
            this.networkHandler.remove();
        }

        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
            /**
             *
             *
             *
             *
             */
            if (this.networkHandler) {
                this.networkHandler.remove();
            }

            this.resume_subs = this.platform.resume.subscribe(() => {});

            this.pause_subs = this.platform.pause.subscribe(() => {
                NetworkManager.getInstance().disconnect();
            });
            /**
             *
             *
             */
            this.networkHandler = Network.addListener('networkStatusChange', (status) => {
                if (!status.connected) {
                    this.printMessage('Internet disconnected', 'danger');
                    NetworkManager.getInstance().disconnect();
                } else {
                    this.printMessage('Your are online.', 'success');
                    NetworkManager.getInstance().reConnect();
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
