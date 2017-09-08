import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    moduleId: module.id,
    selector: 'app',
    templateUrl: 'default.html'
})

export class DefaultComponent{
        
    constructor(private router: Router){
        
    }

    showMenu() {
        if (sessionStorage.getItem('token')) {
            return true;
        }
        return false;
    }

    logOut(){
        sessionStorage.clear();
        this.router.navigateByUrl("login");
    }
}