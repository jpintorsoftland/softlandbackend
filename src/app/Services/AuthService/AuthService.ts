import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import '../../rxjs/index';
import { MobileUsuario } from '../../Classes/MobileUsuario';

@Injectable()
export class AuthService{
    private apiUrl = "http://softlandcloudbackendcert.azurewebsites.net/api/";

    constructor(private http: Http){}


    login(usuario: MobileUsuario): Observable<boolean> { 
        let body = 'Email=' + usuario.email + '&Password=' + usuario.password;

        console.log("body: " + body);

        let headers = new Headers({ 'Content-type': 'application/x-www-form-urlencoded'});
        let options = new RequestOptions({ 'headers': headers }); 

        return this.http.post(this.getUrl('jwt'), body, options).map(this.getDatos).catch(this.error);
    }

    logout(): void{
        sessionStorage.removeItem('token');
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