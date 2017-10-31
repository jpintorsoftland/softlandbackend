import { ClientComponent } from './../client/client.component';
import { MobileAdminClientes } from './../../Classes/MobileAdminClientes';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MobileLicencia } from '../../Classes/MobileLicencia';
import { MobileCliente } from '../../Classes/MobileCliente';
import { MobileInstancia } from '../../Classes/MobileInstancia';
import { MobileEmpresa } from '../../Classes/MobileEmpresa';
import { MobileModulo } from '../../Classes/MobileModulo';
import { MobileTipoPermiso } from '../../Classes/MobileTipoPermiso';
import { Router } from '@angular/router';
import { CRUDService } from '../../Services/CRUDService/CRUDService';
import { environment } from '../../../environments/environment';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

@Component({
    selector: 'app',
    templateUrl: 'form-license.component.html'
})
export class FormLicenseComponent implements OnInit{
    private idLicencia: number;
    private isNew: boolean;
    private idAdmin: number;
    @Input() licencia: MobileLicencia = new MobileLicencia(0, 0, 0, 0, 0, 0, "", "", "", "", new Date(), new Date(), false, true);
    @Input() clientes: Array<MobileCliente>;
    @Input() instancias: Array<MobileInstancia>;
    @Input() empresas: Array<MobileEmpresa>;
    @Input() modulos: Array<MobileModulo>;
    @Input() tipos_permiso: Array<MobileTipoPermiso>;
    @ViewChild('modal')
    public modal: ModalComponent;
    

    constructor(private servicio: CRUDService, private router: Router){
        this.idAdmin = Number( sessionStorage.getItem('idAdmin') );
        this.idLicencia = Number(sessionStorage.getItem("idLicenciaSelected"));
        if(this.idLicencia) this.isNew = false;
        else this.isNew = true;

    }


    public ngOnInit(): void{
        if(this.isNew){
            this.getAuxLists();
        }else{
            //get licencia
            this.servicio.urlRequest = environment.urlLicenses;
            this.getLicencia();
        }
    }

    public getAuxLists(){
        //lista de clientes
        this.servicio.urlRequest = environment.urlClients;
        this.getListClientes();

        //lista de empresas
        this.servicio.urlRequest = environment.urlCompanies;
        this.getlistEmpresas();

        //lista de instancias
        this.servicio.urlRequest = environment.urlInstances;
        this.getListInstancias();

        //lista de modulos
        this.servicio.urlRequest = environment.urlModules;
        this.getListModulos();

        //lista de tipos permisos
        this.servicio.urlRequest = environment.urlPermissions;
        this.getListTiposPermisos();
    }



    /***************************************************************************/
    //gets
    public getLicencia(): void{
        this.servicio.getItemById(this.idLicencia).subscribe(data => {
          this.licencia = data;
          if(this.licencia.fechaInicio) this.licencia.fechaInicio = new Date(this.licencia.fechaInicio);
          if(this.licencia.fechaFin) this.licencia.fechaFin = new Date(this.licencia.fechaFin);
          this.getAuxLists();
        }, e => {
          sessionStorage.removeItem('token');
          this.router.navigate(['/login']);
        });
  
      }

    public getListClientes(): void{
        let uri  = environment.urlClientsFilter + "/" + this.idAdmin;
        let url = this.servicio.getUrl(uri);
  
        this.servicio.getList(url).subscribe(data => {
          this.clientes = data;
        }, e => {
          sessionStorage.removeItem('token');
          this.router.navigate(['/login']);
        });
  
      }
  
      public buscarCliente(id: number): any{
        if(this.clientes!=null){
          if(this.clientes.length>0){
            return this.clientes.find(x => x.idCliente === id);
          }else{
            return new MobileCliente(0, 0, "", "", true);
          }
        }
      }
  
      //instancias
      public getListInstancias(): void{
        let uri  = environment.urlInstancesFilter + "/" + this.idAdmin;
        let url = this.servicio.getUrl(uri);
      
        this.servicio.getList(url).subscribe(data => {
          this.instancias = data;
        }, e => {
          sessionStorage.removeItem('token');
          this.router.navigate(['/login']);
        });
    
        }
    
        public buscarInstancia(id: number): any{
          if(this.instancias!=null){
            if(this.instancias.length>0){
              return this.instancias.find(x => x.idInstancia === id);
            }else{
              return new MobileInstancia(0, 0, 0, "", "", "", true);
            }
          }
        }
  
  
      //modulos
      public getListModulos(): void{
        this.servicio.getList().subscribe(data => {
          this.modulos = data;
        }, e => {
          sessionStorage.removeItem('token');
          this.router.navigate(['/login']);
        });
  
      }
  
      public buscarModulo(id: number): any{
        if(this.modulos!=null){
          if(this.modulos.length>0){
            return this.modulos.find(x => x.idModulo === id);
          }else{
            return new MobileModulo(0, "", true);
          }
        }
      }
  
  
      //empresas
      public getlistEmpresas(): void{
        let uri  = environment.urlCompaniesFilter + "/" + this.idAdmin;
        let url = this.servicio.getUrl(uri);
  
        this.servicio.getList(url).subscribe(data => {
          this.empresas = data;
        }, e => {
          sessionStorage.removeItem('token');
          this.router.navigate(['/login']);
        });
  
      }
  
      public buscarEmpresa(id: number): any{
        if(this.empresas!=null){
          if(this.empresas.length>0){
            return this.empresas.find(x => x.idEmpresa === id);
          }else{
            return new MobileEmpresa(0, 0, 0, "", "", "", "", true);
          }
        }
      }
  
  
      //tipos_permisos
      public getListTiposPermisos(): void{
        this.servicio.getList().subscribe(data => {
          this.tipos_permiso = data;
        }, e => {
          sessionStorage.removeItem('token');
          this.router.navigate(['/login']);
        });
  
      }
  
      public buscarTipoPermiso(id: number): any{
        if(this.tipos_permiso!=null){
          if(this.tipos_permiso.length>0){
            return this.tipos_permiso.find(x => x.idTipoPermiso === id);
          }else{
            return new MobileTipoPermiso(0, "");
          }
        }
      }
      /***************************************************************************/


      /***************************************************************************/
      //actions
      public guardar(){
        this.servicio.urlRequest = environment.urlLicenses;

        if(!this.licencia.caduca){
          this.licencia.fechaInicio = null;
          this.licencia.fechaFin = null;
        }
      
        if(this.isNew){
              this.servicio.add(this.licencia).subscribe(data => {
                  this.router.navigate(["/licencias"]);
              }, e =>{
                  sessionStorage.removeItem("token");
                  this.router.navigate(["/login"]);
              });
        }else{
          this.servicio.update(this.licencia, this.licencia.idLicencia).subscribe(data => {
              this.modal.open();
              this.getLicencia();
          }, e =>{
              sessionStorage.removeItem("token");
              this.router.navigate(["/login"]);
          });
        }
        
      }

      public formatDate(myStringDate): Date {
        return  new Date(myStringDate.substr(0, 10) );
      }


      /***************************************************************************/
  
}
