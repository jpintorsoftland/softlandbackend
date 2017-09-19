import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable()
export class ConsultantGuard implements CanActivate{
    
    constructor(private router: Router){}

    canActivate(){

        try{
            if(sessionStorage.getItem("idRolAdmin")=="1" || sessionStorage.getItem("idRolAdmin")=="2"){
                return true;
            }else{
                this.router.navigate(["/login"]);
                return false;
            }
        }catch(Exception){
            return false;
        }
        
    }

}