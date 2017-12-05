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
import { GridComponent, GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { DatePipe } from '@angular/common';
import { ModalConfirmComponent } from '../modal/confirm-modal.component';

@Component({
    selector: 'app',
    templateUrl: 'license.component.html'
})
export class LicenseComponent implements OnInit{
    @Input() licencias = new Array<MobileLicencia>();
    @Input() clientes: Array<MobileCliente>;
    @Input() instancias: Array<MobileInstancia>;
    @Input() empresas: Array<MobileEmpresa>;
    @Input() modulos: Array<MobileModulo>;
    @Input() tipos_permiso: Array<MobileTipoPermiso>;
    @ViewChild('confirmModal')
    public confirmModal: ModalConfirmComponent;
    public confirmModalTitle: string = "Eliminar aplicacion";
    public confirmModalMessage: string = "¿Seguro que desea eliminar el registro?";

    //grid
    public formGroup: FormGroup;
    public editedRowIndex: number;
    public idEdited: number;
    public idAdmin: number;
    public dataRemove: any;

    public state: State = {
      skip: 0,
      take: 12
    };
    public gridData: GridDataResult = process(this.licencias, this.state);

    public dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridData = process(this.licencias, this.state);
    }


    constructor(private servicio: CRUDService, private router: Router){
      this.idAdmin = Number( sessionStorage.getItem('idAdmin') );
      sessionStorage.setItem("idLicenciaSelected", null);
    }


    public ngOnInit(): void{
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
        
        //lista de licencias
        this.servicio.urlRequest = environment.urlLicenses;
        this.getList();
    }

  
    /***************************************************************************/
    //buttons actions 
    public addHandler({sender}) {
      this.closeEditor(sender);

      this.formGroup = new FormGroup({
          //'idLicencia': new FormControl(0),
          'idCliente': new FormControl(0),
          'idEmpresa': new FormControl(0),
          'idInstancia': new FormControl(0),
          'idModulo': new FormControl(0),
          'idTipoPermiso': new FormControl(0),
          'codigoCliente': new FormControl(""),
          'codigoEmpresa': new FormControl(""),
          'codigoInstancia': new FormControl(""),
          'codigoLicencia': new FormControl(""),
          'fechaInicio': new FormControl(Date.now()),
          'fechaFin': new FormControl(Date.now()),
          'caduca': new FormControl(true),
          'activo': new FormControl(true)
      });
      sender.addRow(this.formGroup);
    }

    public editHandler({sender, rowIndex, dataItem}) {
      this.closeEditor(sender);

      this.formGroup = new FormGroup({
          'idCliente': new FormControl(dataItem.idCliente, Validators.required),
          'idEmpresa': new FormControl(dataItem.idEmpresa, Validators.required),
          'idInstancia': new FormControl(dataItem.idInstancia, Validators.required),
          'idModulo': new FormControl(dataItem.idModulo, Validators.required),
          'idTipoPermiso': new FormControl(dataItem.idTipoPermiso, Validators.required),
          'codigoCliente': new FormControl(dataItem.codigoCliente, Validators.required),
          'codigoEmpresa': new FormControl(dataItem.codigoEmpresa, Validators.required),
          'codigoInstancia': new FormControl(dataItem.codigoInstancia, Validators.required),
          'codigoLicencia': new FormControl(dataItem.codigoLicencia, Validators.required),
          'fechaInicio': new FormControl(dataItem.fechaInicio),
          'fechaFin': new FormControl(dataItem.fechaFin),
          'caduca': new FormControl(dataItem.caduca, Validators.required),
          'activo': new FormControl(dataItem.activo, Validators.required)
      });

      this.editedRowIndex = rowIndex;

      sender.editRow(rowIndex, this.formGroup);
  
    }
    

    public cancelHandler({sender, rowIndex}) {
      this.closeEditor(sender, rowIndex);
    }

    public closeEditor(grid, rowIndex = this.editedRowIndex) {
      grid.closeRow(rowIndex);
      this.editedRowIndex = undefined;
      this.formGroup = undefined;
    }
    /***************************************************************************/
    
    public formatDate(myStringDate) {
      console.log("log " + myStringDate);
      return  new Date(myStringDate.substr(0, 10) );
    }

    /***************************************************************************/
    //api actions
    public getList(): void{
      let uri  = environment.urlLicensesFilter + "/" + this.idAdmin;
      let url = this.servicio.getUrl(uri);

      this.servicio.getList(url).subscribe(data => {
        this.licencias = data;
        this.gridData = process(this.licencias, this.state);
      }, e => {
        sessionStorage.removeItem('token');
        this.router.navigate(['/login']);
      });

    }

    public saveHandler({sender, rowIndex, formGroup, isNew}) {
      const dataItem: MobileLicencia = formGroup.value;

      if(isNew){
        this.servicio.add(dataItem).subscribe(data => {
          this.licencias.push(data);
          this.gridData = process(this.licencias, this.state);
        }, e =>{
              sessionStorage.removeItem("token");
              this.router.navigate(["/login"]);
        });
      }else{
        dataItem.idLicencia = this.idEdited;

        this.servicio.update(dataItem, dataItem.idLicencia).subscribe(data => {
            this.getList();
        }, e =>{
            sessionStorage.removeItem("token");
            this.router.navigate(["/login"]);
        });
      }

      sender.closeRow(rowIndex);
    }

    public removeHandler({dataItem}) {
      this.dataRemove = dataItem;
      this.confirmModal.modal.open();
    }

    public remove(){
      if(this.dataRemove){
        this.servicio.delete(this.dataRemove.idLicencia).subscribe(data => {
            this.getList();
            this.confirmModal.modal.close();
        }, e =>{
            sessionStorage.removeItem("token");
            this.router.navigate(["/login"]);
        });
      }
    }


    //clientes
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


    public filtroCliente(idCliente: Number){
      if(idCliente){
          this.gridData = process(this.licencias.filter(item => item.idCliente == idCliente), this.state);
        }else{
          this.gridData = process(this.licencias, this.state);
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


    public filtroInstancia(idInstancia: Number){
      if(idInstancia){
          this.gridData = process(this.licencias.filter(item => item.idInstancia == idInstancia), this.state);
        }else{
          this.gridData = process(this.licencias, this.state);
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


    public filtroModulo(idModulo: Number){
      if(idModulo){
          this.gridData = process(this.licencias.filter(item => item.idModulo == idModulo), this.state);
        }else{
          this.gridData = process(this.licencias, this.state);
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


    public filtroEmpresa(idEmpresa: Number){
      if(idEmpresa){
          this.gridData = process(this.licencias.filter(item => item.idEmpresa == idEmpresa), this.state);
        }else{
          this.gridData = process(this.licencias, this.state);
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


    public loadFormNuevo()
    {
      sessionStorage.setItem("idLicenciaSelected", null);
      this.router.navigate(['/licencias/form']);
    }

    public loadForm(dataItem)
    {
      sessionStorage.setItem("idLicenciaSelected", dataItem.idLicencia);
      this.router.navigate(['/licencias/form']);
    }
    /***************************************************************************/

}
