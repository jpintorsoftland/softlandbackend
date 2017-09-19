import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import '../../rxjs/index';
import { MobileAdmin } from '../../Classes/MobileAdmin';
import { environment } from '../../../environments/environment';

@Injectable()
export class AuthService{
    private apiUrl  = environment.apiURL;

    constructor(private http: Http){}


    login(admin: MobileAdmin): Observable<boolean> { 
        let body = 'Email=' + admin.email + '&Password=' + admin.password;

        let headers = new Headers({ 'Content-type': 'application/x-www-form-urlencoded'});
        let options = new RequestOptions({ 'headers': headers }); 

        return this.http.post(this.getUrl('jwt'), body, options).map(this.getDatos).catch(this.error);
    }

    logout(): void{
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('idAdmin');
        sessionStorage.removeItem('idRolAdmin');
        sessionStorage.removeItem('email');
        sessionStorage.removeItem('password');
    }

    private error(error: any){
        let msg = (error.message) ? error.message : "Ha ocurrido un error";
        return Observable.throw(msg);
    }

    private getDatos(data: Response){
        let datos = data.json();

        if(datos && datos.access_token) {
            sessionStorage.setItem('token', datos.access_token);
            return true;
        }
        return false;
    }

    private getUrl(model: String){
        return this.apiUrl + model;
    }

}