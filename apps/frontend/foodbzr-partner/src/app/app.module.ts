import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FcmService } from './fcm.service';
import { CanLoadRouteGuard } from './main_route.guard';

@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
    providers: [FcmService, CallNumber, PhotoViewer, StatusBar, SplashScreen, { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, CanLoadRouteGuard],
    bootstrap: [AppComponent],
})
export class AppModule {}
