import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MobileEmpresa } from '../../Classes/MobileEmpresa';
import { MobileCliente } from '../../Classes/MobileCliente';
import { MobileInstancia } from '../../Classes/MobileInstancia';
import { Router } from '@angular/router';
import { CRUDService } from '../../Services/CRUDService/CRUDService';
import { environment } from '../../../environments/environment';
import { GridComponent, GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { ModalConfirmComponent } from '../modal/confirm-modal.component';

@Component({
    selector: 'app',
    templateUrl: 'company.component.html'
})
export class CompanyComponent implements OnInit{
    @Input() empresas = new Array<MobileEmpresa>();
    @Input() clientes: Array<MobileCliente>;
    @Input() instancias: Array<MobileInstancia>;
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
    public gridData: GridDataResult = process(this.empresas, this.state);

    public dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridData = process(this.empresas, this.state);
    }


    constructor(private servicio: CRUDService, private router: Router){
      this.idAdmin = Number( sessionStorage.getItem('idAdmin') );
    }


    public ngOnInit(): void{
        //lista de clientes
        this.servicio.urlRequest = environment.urlClients;
        this.getListClientes();

        //lista de instancias
        this.servicio.urlRequest = environment.urlInstances;
        this.getListInstancias();
        
        //lista de empresas
        this.servicio.urlRequest = environment.urlCompanies;
        this.getList();
    }

  
    /***************************************************************************/
    //buttons actions 
    public addHandler({sender}) {
      this.closeEditor(sender);

      this.formGroup = new FormGroup({
          //'idEmpresa': new FormControl(0),
          'idInstancia': new FormControl("", Validators.required),
          'idCliente': new FormControl("", Validators.required),
          'codigoEmpresa': new FormControl("", Validators.required),
          'codigoInstancia': new FormControl(""),
          'codigoCliente': new FormControl(""),
          'nombreEmpresa': new FormControl("", Validators.required),
          'activo': new FormControl(true)
      });
      sender.addRow(this.formGroup);
    }

    public editHandler({sender, rowIndex, dataItem}) {
      this.closeEditor(sender);

      this.idEdited = dataItem.idEmpresa;
      this.formGroup = new FormGroup({
          'idInstancia': new FormControl(dataItem.idInstancia, Validators.required),
          'idCliente': new FormControl(dataItem.idCliente, Validators.required),
          'codigoEmpresa': new FormControl(dataItem.codigoEmpresa, Validators.required),
          'codigoInstancia': new FormControl(dataItem.codigoInstancia),
          'codigoCliente': new FormControl(dataItem.codigoCliente),
          'nombreEmpresa': new FormControl(dataItem.nombreEmpresa, Validators.required),
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
    


    /***************************************************************************/
    //api actions
    public getList(): void{
      let uri  = environment.urlCompaniesFilter + "/" + this.idAdmin;
      let url = this.servicio.getUrl(uri);

      this.servicio.getList(url).subscribe(data => {
        this.empresas = data;
        this.gridData = process(this.empresas, this.state);
      }, e => {
        sessionStorage.removeItem('token');
        this.router.navigate(['/login']);
      });

    }

    public saveHandler({sender, rowIndex, formGroup, isNew}) {
      const dataItem: MobileEmpresa = formGroup.value;


      if(isNew){
        this.servicio.add(dataItem).subscribe(data => {
          this.empresas.push(data);
          this.gridData = process(this.empresas, this.state);
        }, e =>{
              sessionStorage.removeItem("token");
              this.router.navigate(["/login"]);
        });
      }else{
        dataItem.idEmpresa = this.idEdited;
        this.servicio.update(dataItem, dataItem.idEmpresa).subscribe(data => {
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
        this.servicio.delete(this.dataRemove.idEmpresa).subscribe(data => {
            this.getList();
            this.confirmModal.modal.close();
        }, e =>{
            sessionStorage.removeItem("token");
            this.router.navigate(["/login"]);
        });
      }
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

    public filtroCliente(idCliente: Number){
      if(idCliente){
          this.gridData = process(this.empresas.filter(item => item.idCliente == idCliente), this.state);
        }else{
          this.gridData = process(this.empresas, this.state);
        }
    }

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
            this.gridData = process(this.empresas.filter(item => item.idInstancia == idInstancia), this.state);
          }else{
            this.gridData = process(this.empresas, this.state);
          }
      }

    /***************************************************************************/

}
