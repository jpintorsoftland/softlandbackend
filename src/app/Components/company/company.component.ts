import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MobileEmpresa } from '../../Classes/MobileEmpresa';
import { MobileCliente } from '../../Classes/MobileCliente';
import { MobileInstancia } from '../../Classes/MobileInstancia';
import { Router } from '@angular/router';
import { CRUDService } from '../../Services/CRUDService/CRUDService';
import { environment } from '../../../environments/environment';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';

@Component({
    selector: 'app',
    templateUrl: 'company.html'
})
export class CompanyComponent implements OnInit{
    @Input() gridData: Array<MobileEmpresa>;
    @Input() clientes: Array<MobileCliente>;
    @Input() instancias: Array<MobileInstancia>;

    //grid
    public formGroup: FormGroup;
    private editedRowIndex: number;
    public idEdited: number;
    private idAdmin: number;


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
    protected addHandler({sender}) {
      this.closeEditor(sender);

      this.formGroup = new FormGroup({
          //'idEmpresa': new FormControl(0),
          'idInstancia': new FormControl("", Validators.required),
          'idCliente': new FormControl("", Validators.required),
          'codigoEmpresa': new FormControl("", Validators.required),
          'codigoInstancia': new FormControl("", Validators.required),
          'codigoCliente': new FormControl("", Validators.required),
          'nombreEmpresa': new FormControl("", Validators.required),
          'activo': new FormControl(true)
      });
      sender.addRow(this.formGroup);
    }

    protected editHandler({sender, rowIndex, dataItem}) {
      this.closeEditor(sender);

      let controlId = new FormControl(dataItem.idEmpresa);
      controlId.disable();
      this.idEdited = dataItem.idEmpresa;
      this.formGroup = new FormGroup({
          'idEmpresa': controlId,
          'idInstancia': new FormControl(dataItem.idInstancia, Validators.required),
          'idCliente': new FormControl(dataItem.idCliente, Validators.required),
          'codigoEmpresa': new FormControl(dataItem.codigoEmpresa, Validators.required),
          'codigoInstancia': new FormControl(dataItem.codigoInstancia, Validators.required),
          'codigoCliente': new FormControl(dataItem.codigoCliente, Validators.required),
          'nombreEmpresa': new FormControl(dataItem.nombreEmpresa, Validators.required),
          'activo': new FormControl(dataItem.activo, Validators.required)
      });

      this.editedRowIndex = rowIndex;

      sender.editRow(rowIndex, this.formGroup);
  
    }
    

    protected cancelHandler({sender, rowIndex}) {
      this.closeEditor(sender, rowIndex);
    }

    private closeEditor(grid, rowIndex = this.editedRowIndex) {
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
        this.gridData = data;
      }, e => {
        sessionStorage.removeItem('token');
        this.router.navigate(['/login']);
      });

    }

    protected saveHandler({sender, rowIndex, formGroup, isNew}) {
      const dataItem: MobileEmpresa = formGroup.value;


      if(isNew){
        this.servicio.add(dataItem).subscribe(data => {
          this.gridData.push(data);
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

    protected removeHandler({dataItem}) {
        this.servicio.delete(dataItem, dataItem.idEmpresa).subscribe(data => {
            this.getList();
        }, e =>{
            sessionStorage.removeItem("token");
            this.router.navigate(["/login"]);
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
    /***************************************************************************/

}
