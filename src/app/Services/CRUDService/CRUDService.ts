import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import '../../rxjs/index';
import { environment } from '../../../environments/environment';

@Injectable()
export class CRUDService{
    private apiUrl = environment.apiURL;
    public urlRequest = environment.urlClients;

    constructor(private http: Http){
    }

    /***************************************************************************/
    //CRUD
    getList(): Observable<any[]>{
        return this.http.get(this.getUrl(this.urlRequest), this.getOptions() ).map(this.getDatos).catch(this.error);
    }

    getItemById(model: any, id: any): Observable<any[]>{
        return this.http.get(this.getUrl(this.urlRequest) + '/' + id, this.getOptions() ).map(this.getDatos).catch(this.error);
    }

    add(model: any): Observable<any> { 
        return this.http.post(this.getUrl(this.urlRequest), model, this.getOptions() ).map(this.getDatos).catch(this.error);
    }

    delete(model: any, id: any) { 
        return this.http.delete(this.getUrl(this.urlRequest) + '/' + id, this.getOptions() ).catch(this.error);
    }

    update(model: any, id: any) { 
        return this.http.put(this.getUrl(this.urlRequest) + '/' + id, model, this.getOptions() ).catch(this.error);
    }
    /***************************************************************************/


    /***************************************************************************/
    //request build
    private getUrl(route: string){
        return this.apiUrl + route;
    }

    private getOptions(): RequestOptions {
        let auth = new Headers({ 'Authorization': 'Bearer ' + sessionStorage.getItem('token') });
        let options = new RequestOptions({ headers: auth});
        return options;
    }
    /***************************************************************************/

    /***************************************************************************/
    //responses
    private error(error: any){
        let msg = (error.message) ? error.message : "Ha ocurrido un error";
        console.log(msg);
        return Observable.throw(msg);
    }

    private getDatos(data: Response){
        let datos = data.json();
        return datos || [];
    }
    /***************************************************************************/


}