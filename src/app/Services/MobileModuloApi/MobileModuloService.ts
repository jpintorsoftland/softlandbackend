import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import '../../rxjs/index';
import { MobileModulo } from '../../Classes/MobileModulo';

@Injectable()
export class MobileModuloService{
    private apiUrl = "http://softlandcloudbackendcert.azurewebsites.net/api/";

    constructor(private http: Http){}

    getModulos(): Observable<MobileModulo[]>{
        return this.http.get(this.getUrl('modulos'), this.getOptions() ).map(this.getDatos).catch(this.error);
    }

    addModulo(model: MobileModulo): Observable<MobileModulo> { 
        return this.http.post(this.getUrl('modulos'), model, this.getOptions() ).map(this.getDatos).catch(this.error);
    }

    deleteModulo(model: MobileModulo) { 
        return this.http.delete(this.getUrl('modulos') + '/' + model.idModulo, this.getOptions() ).catch(this.error);
    }

    updateModulo(model: MobileModulo) { 
        return this.http.put(this.getUrl('modulos') + '/' + model.idModulo, model, this.getOptions() ).catch(this.error);
    }

    private error(error: any){
        let msg = (error.message) ? error.message : "Ha ocurrido un error";
        console.log(msg);
        return Observable.throw(msg);
    }

    private getDatos(data: Response){
        let datos = data.json();
        return datos || [];
    }

    private getUrl(model: String){
        return this.apiUrl + model;
    }

    private getOptions(): RequestOptions {
        let auth = new Headers({ 'Authorization': 'Bearer ' + sessionStorage.getItem('token') });
        let options = new RequestOptions({ headers: auth});
        return options;
    }

}