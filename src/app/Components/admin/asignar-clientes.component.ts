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
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

import { SHA1 } from 'crypto-js';

@Component({
    selector: 'app',
    templateUrl: 'asignar-clientes.component.html'
})
export class AsignarClientesComponent implements OnInit{
    private idAdmin: number;
    @Input() nombreAdmin: string;
    @Input() clientes: Array<MobileCliente>;
    @Input() clientes_asignados: Array<MobileAdminClientes>;
    @ViewChild('modal')
    public modal: ModalComponent;
    

    constructor(private servicio: CRUDService, private router: Router){
        this.idAdmin = Number(sessionStorage.getItem("idAdminSelected"));
        this.nombreAdmin = sessionStorage.getItem("nombreAdminSelected");
    }


    public ngOnInit(): void{
        //lista de roles
        this.servicio.urlRequest = environment.urlClients;
        this.getListClientes();
    }

    public getListClientes(): void{
        this.servicio.getList().subscribe(data => {
            this.clientes = data;
            this.getListClientesAsignados();
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

    public checkAsigned()
    {
        for (var i = 0; i < this.clientes.length; i++)
        {
            let cliente = this.clientes[i];
            if(this.clientes_asignados.find(x => x.idCliente == cliente.idCliente))
            {
                cliente.activo = true;
            }else{
                cliente.activo = false;
            }
        }

    }

    public guardar()
    {
        this.limpiarAsignados();
    }

    private limpiarAsignados()
    {
        let uri  = environment.urlUsersAsigned + "/limpiar";
        let url = this.servicio.getUrl(uri);

        this.servicio.delete(this.idAdmin, url).subscribe(data => {
            this.reasignarUsuarios();
        }, e =>{
            sessionStorage.removeItem("token");
            this.router.navigate(["/login"]);
        });
    }

    private reasignarUsuarios(){
        let asignados = new Array<MobileAdminClientes>();
        
        for (var i = 0; i < this.clientes.length; i++)
        {
            let cliente = this.clientes[i];
            if(cliente.activo){
                let asignado = new MobileAdminClientes(0, this.idAdmin, cliente.idCliente);
                asignados.push(asignado);
            }
        }

        let uri  = environment.urlUsersAsigned + "/sincronizacion";
        let url = this.servicio.getUrl(uri);

        this.servicio.add(asignados, url).subscribe(data => {
            this.modal.open();
            this.getListClientesAsignados();
        }, e =>{
            sessionStorage.removeItem("token");
            this.router.navigate(["/login"]);
        });

    }

  
}
