import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MobileInstancia } from '../../Classes/MobileInstancia';
import { MobileCliente } from '../../Classes/MobileCliente';
import { MobileProyecto } from '../../Classes/MobileProyecto';
import { Router } from '@angular/router';
import { CRUDService } from '../../Services/CRUDService/CRUDService';
import { environment } from '../../../environments/environment';
import { GridComponent, GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { ModalConfirmComponent } from '../modal/confirm-modal';

@Component({
    selector: 'app',
    templateUrl: 'instance.html'
})
export class InstanceComponent implements OnInit{
    @Input() instancias = new Array<MobileInstancia>();
    @Input() proyectos: Array<MobileProyecto>;
    @Input() clientes: Array<MobileCliente>;
    @ViewChild('confirmModal')
    public confirmModal: ModalConfirmComponent;
    public confirmModalTitle: string = "Eliminar aplicacion";
    public confirmModalMessage: string = "¿Seguro que desea eliminar el registro?";

    //grid
    public formGroup: FormGroup;
    private editedRowIndex: number;
    public idEdited: number;
    private idAdmin: number;
    public activoEdited: boolean;
    public dataRemove: any;

    private state: State = {
      skip: 0,
      take: 12
    };
    private gridData: GridDataResult = process(this.instancias, this.state);

    protected dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridData = process(this.instancias, this.state);
    }



    constructor(private servicio: CRUDService, private router: Router){
      this.idAdmin = Number( sessionStorage.getItem('idAdmin') );
    }


    public ngOnInit(): void{
        //lista de proyectos
        this.servicio.urlRequest = environment.urlProjects;
        this.getListProyectos();

        //lista de clientes
        this.servicio.urlRequest = environment.urlClients;
        this.getListClientes();
        
        //lista de instancias
        this.servicio.urlRequest = environment.urlInstances;
        this.getList();
    }

  
    /***************************************************************************/
    //buttons actions 
    protected addHandler({sender}) {
      this.closeEditor(sender);

      this.formGroup = new FormGroup({
          'idCliente': new FormControl("", Validators.required),
          'idProyecto': new FormControl("", Validators.required),
          'codigoInstancia': new FormControl("", Validators.required),
          'codigoCliente': new FormControl("", Validators.required),
          'nombreInstancia': new FormControl("", Validators.required)
      });
      sender.addRow(this.formGroup);
    }

    protected editHandler({sender, rowIndex, dataItem}) {
      this.closeEditor(sender);

      this.idEdited = dataItem.idInstancia;
      this.activoEdited = dataItem.activo;
      this.formGroup = new FormGroup({
          'idCliente': new FormControl(dataItem.idCliente, Validators.required),
          'idProyecto': new FormControl(dataItem.idProyecto, Validators.required),
          'codigoInstancia': new FormControl(dataItem.codigoInstancia, Validators.required),
          'codigoCliente': new FormControl(dataItem.codigoCliente, Validators.required),
          'nombreInstancia': new FormControl(dataItem.nombreInstancia, Validators.required)
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
      let uri  = environment.urlInstancesFilter + "/" + this.idAdmin;
      let url = this.servicio.getUrl(uri);

      this.servicio.getList(url).subscribe(data => {
        this.instancias = data;
        this.gridData = process(this.instancias, this.state);
      }, e => {
        sessionStorage.removeItem('token');
        this.router.navigate(['/login']);
      });

    }

    protected saveHandler({sender, rowIndex, formGroup, isNew}) {
      const dataItem: MobileInstancia = formGroup.value;

      if(isNew){
        this.servicio.add(dataItem).subscribe(data => {
          this.instancias.push(data);
          this.gridData = process(this.instancias, this.state);
        }, e =>{
              sessionStorage.removeItem("token");
              this.router.navigate(["/login"]);
        });
      }else{
        dataItem.idInstancia = this.idEdited;
        dataItem.activo = this.activoEdited;
        this.servicio.update(dataItem, dataItem.idInstancia).subscribe(data => {
            this.getList();
        }, e =>{
            sessionStorage.removeItem("token");
            this.router.navigate(["/login"]);
        });
      }

      sender.closeRow(rowIndex);
    }

    protected removeHandler({dataItem}) {
      this.dataRemove = dataItem;
      this.confirmModal.modal.open();
    }

    public remove(){
      if(this.dataRemove){
        this.servicio.delete(this.dataRemove.idInstancia).subscribe(data => {
            this.getList();
            this.confirmModal.modal.close();
        }, e =>{
            sessionStorage.removeItem("token");
            this.router.navigate(["/login"]);
        });
      }
    }

    public getListProyectos(): void{
      this.servicio.getList().subscribe(data => {
        this.proyectos = data;
      }, e => {
        sessionStorage.removeItem('token');
        this.router.navigate(['/login']);
      });

    }

    public buscarProyecto(id: number): any{
      if(this.proyectos){
        if(this.proyectos.length>0){
          let proyecto = this.proyectos.find(x => x.idProyecto === id);
          return proyecto;
        }else{
          return new MobileProyecto(0, "");
        }
      }
    }

    public filtroProyecto(idProyecto: Number){
        if(idProyecto){
          this.gridData = process(this.instancias.filter(item => item.idProyecto == idProyecto), this.state);
        }else{
          this.gridData = process(this.instancias, this.state);
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
          this.gridData = process(this.instancias.filter(item => item.idCliente == idCliente), this.state);
        }else{
          this.gridData = process(this.instancias, this.state);
        }
    }

    /***************************************************************************/

}
