import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import '../../rxjs/index';
import { environment } from '../../../environments/environment';

@Injectable()
export class CRUDService{
    private apiUrl = environment.apiURL;
    public urlRequest = "";

    constructor(private http: Http){
    }

    /***************************************************************************/
    //CRUD
    getList(url : string = this.getUrl(this.urlRequest) ): Observable<any[]>{
        return this.http.get(url, this.getOptions() ).map(this.getDatos).catch(this.error);
    }

    getItemById(model: any, id: any, url : string = this.getUrl(this.urlRequest) ): Observable<any[]>{
        return this.http.get(url + '/' + id, this.getOptions() ).map(this.getDatos).catch(this.error);
    }

    add(model: any, url : string = this.getUrl(this.urlRequest) ): Observable<any> { 
        return this.http.post(url, model, this.getOptions() ).map(this.getDatos).catch(this.error);
    }

    delete(model: any, id: any, url : string = this.getUrl(this.urlRequest) ) { 
        return this.http.delete(url + '/' + id, this.getOptions() ).catch(this.error);
    }

    update(model: any, id: any, url : string = this.getUrl(this.urlRequest) ) { 
        return this.http.put(url + '/' + id, model, this.getOptions() ).catch(this.error);
    }
    /***************************************************************************/


    /***************************************************************************/
    //request build
    public getUrl(route: string){
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