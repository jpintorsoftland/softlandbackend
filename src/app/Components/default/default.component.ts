import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    moduleId: module.id,
    selector: 'app',
    templateUrl: 'default.component.html'
})

export class DefaultComponent{
    public isSuperAdmin: boolean;
    public isConsultant: boolean;
    public isAdminClient: boolean;
    public isLoged: boolean;
    public nombreAdmin: string;
        
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
                this.isAdminClient = true;
                break;
            case "2":
                this.isConsultant = true;
                this.isAdminClient = true;
                break;
            case "3":
                this.isAdminClient = true;
                break;
        }

        this.nombreAdmin = sessionStorage.getItem("nombreAdmin");

    }

    logOut(){
        sessionStorage.clear();
        this.router.navigateByUrl("login");
    }
}