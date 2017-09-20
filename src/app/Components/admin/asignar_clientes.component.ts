import { ClientComponent } from './../client/client.component';
import { MobileAdminClientes } from './../../Classes/MobileAdminClientes';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MobileAdmin } from '../../Classes/MobileAdmin';
import { MobileRolAdmin } from '../../Classes/MobileRolAdmin';
import { MobileCliente } from './../../Classes/MobileCliente';
import { Router } from '@angular/router';
import { CRUDService } from '../../Services/CRUDService/CRUDService';
import { environment } from '../../../environments/environment';

import { SHA1 } from 'crypto-js';

@Component({
    selector: 'app',
    templateUrl: 'asignar_clientes.html'
})
export class AsignarClientesComponent implements OnInit{
    private idAdmin: number;
    @Input() nombreAdmin: string;
    @Input() clientes: Array<MobileCliente>;
    @Input() clientes_asignados: Array<MobileAdminClientes>;
    

    constructor(private servicio: CRUDService, private router: Router){
        this.idAdmin = Number(sessionStorage.getItem("idRolAdmin"));
        this.nombreAdmin = sessionStorage.getItem("nombreAdmin");
    }


    public ngOnInit(): void{
        //lista de roles
        this.servicio.urlRequest = environment.urlClients;
        this.getListClientes();

        this.getListClientesAsignados();
    }

    public getListClientes(): void{
        this.servicio.getList().subscribe(data => {
            this.clientes = data;
        }, e => {
            sessionStorage.removeItem('token');
            this.router.navigate(['/login']);
        });

    }


    public getListClientesAsignados(): void{
        let uri  = environment.urlUsersAsigned + "/" + this.idAdmin;
        let url = this.servicio.getUrl(uri);

        this.servicio.getList(url).subscribe(data => {
            this.clientes_asignados = data;
            this.checkAsigned();
        }, e => {
            sessionStorage.removeItem('token');
            this.router.navigate(['/login']);
        });

    }

    public checkAsigned(){
        /*
        var cliente: MobileCliente;
        for (cliente in this.clientes) {
            this.clientes_asignados.find(x=> x.idCliente == cliente.idCliente);
         }
        */

        console.log("0");
         for (let key in this.clientes) {
            let cliente = this.clientes[key];
            console.log("1");
            if(this.clientes_asignados.find(x=> x.idCliente == cliente.idCliente))
            {
                cliente.activo = true;
                console.log("activos");
            }else{
                cliente.activo = false;
            }
            
        }
    }

    public guardar()
    {
        this.router.navigate(['/administradores']);
    }

  
}
