import { DefaultComponent } from './../default/default.component';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/AuthService/AuthService';
import { CRUDService } from '../../Services/CRUDService/CRUDService';
import { MobileAdmin} from '../../Classes/MobileAdmin';
import { environment } from '../../../environments/environment';

import { SHA1 } from 'crypto-js';

@Component({
    moduleId: module.id,
    templateUrl: 'login.component.html',
    selector: 'app'
})

export class LoginComponent implements OnInit{
    model: MobileAdmin = new MobileAdmin(0, "", "", "", 0, true);
    error = '';
    loading: boolean = false;

    constructor( private router: Router,
                private authentificationService: AuthService,
                private crudService: CRUDService){ }

    ngOnInit(){
        this.authentificationService.logout();
    }

    login(){
        this.loading = true;

        let pass = SHA1(this.model.password).toString();

        let admin = new MobileAdmin(0, "", this.model.email, pass, 0, true );

        this.authentificationService.login(admin)
            .subscribe(result => {
                    if(result === true) {
                        //this.router.navigate(['/']);
                        this.logadmin(admin);
                    } else {
                        this.error = "Datos de acceso incorrectos";
                        this.loading = false;
                    }
            }, e => {
                    this.error = 'Datos de acceso incorrectos';
                    this.loading = false;
            });
    }

    logadmin(admin){
        this.crudService.urlRequest = environment.urlLogin;
        this.crudService.add(admin)
            .subscribe(result => {
                
                if(result === false){
                    this.error = "Datos de acceso incorrectos";
                    this.loading = false;
                }else{
                    sessionStorage.setItem('idRolAdmin', result.idRolAdmin);
                    sessionStorage.setItem('idAdmin', result.idAdmin);
                    sessionStorage.setItem('nombreAdmin', result.nombreAdmin);
                    sessionStorage.setItem('email', result.email);
                    sessionStorage.setItem('password', result.password);

                    if (result.idRolAdmin==1) this.router.navigate(['/administradores']);
                    else if(result.idRolAdmin==2) this.router.navigate(['/clientes']);
                    else this.router.navigate(['/instancias']);
                   
                }
            }, e => {
                    this.error = 'Datos de acceso incorrectos';
                    this.loading = false;
                    this.removeToken();
            });
    }

    removeToken(){
        sessionStorage.removeItem("token");
    }

}