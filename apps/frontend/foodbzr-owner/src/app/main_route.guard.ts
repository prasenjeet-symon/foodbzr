import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable()
export class CanLoadRouteGuard implements CanActivate {
    constructor(private router: Router) {}

    canActivate() {
        const user_id = localStorage.getItem('owner_row_uuid');
        if (!user_id) {
            this.router.navigate(['auth']);
            return false;
        } else {
            return true;
        }
    }
}
