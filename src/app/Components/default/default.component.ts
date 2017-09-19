import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    moduleId: module.id,
    selector: 'app',
    templateUrl: 'default.html'
})

export class DefaultComponent{
    public isSuperAdmin: boolean;
    public isConsultant: boolean;
    public isLoged: boolean;
        
    constructor(private router: Router){
        this.isLoged = false;
    }

    ngOnInit(){

    }

    showMenu() {
        if (sessionStorage.getItem('idRolAdmin')) {
            if(!this.isLoged)this.showOptions();
            return true;
        }else{
            this.isLoged = false;
            return false;
        }
    }

    showOptions(){
        this.isLoged = true;
        let idRolAdmin = sessionStorage.getItem('idRolAdmin');

        this.isSuperAdmin = false;
        this.isConsultant = false;
        switch(idRolAdmin){
            case "1":
                this.isSuperAdmin = true;
                this.isConsultant = true;
                break;
            case "2":
                this.isConsultant = true;
                break;
        }

    }

    logOut(){
        sessionStorage.clear();
        this.router.navigateByUrl("login");
    }
}