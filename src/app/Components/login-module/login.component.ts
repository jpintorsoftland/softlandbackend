import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/AuthService/AuthService';
import { MobileUsuario} from '../../Classes/MobileUsuario';

@Component({
    moduleId: module.id,
    templateUrl: 'login.html',
    selector: 'login'
})

export class LoginComponent implements OnInit{
    model: MobileUsuario = new MobileUsuario(0, 0, '', '', '', '', '', false);
    error = '';
    loading: boolean = false;

    constructor( private router: Router,
                private authentificationService: AuthService){ }

    ngOnInit(){
        this.authentificationService.logout();
    }

    login(){
        this.loading = true;
        this.authentificationService.login(this.model)
            .subscribe(result => {
                    console.log("result: " + result);
                    if(result === true) {
                        this.router.navigate(['/']);
                    } else {
                        this.error = "Datos de acceso incorrectos";
                        this.loading = false;
                    }
            }, e => {
                    this.error = 'Datos de acceso incorrectos';
                    this.loading = false;
            });
    }

}