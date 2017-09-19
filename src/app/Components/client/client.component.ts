import { Component, OnInit, Input, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MobileCliente } from '../../Classes/MobileCliente';
import { MobileProyecto } from '../../Classes/MobileProyecto'
import { Router } from '@angular/router';
import { CRUDService } from '../../Services/CRUDService/CRUDService';
import { environment } from '../../../environments/environment';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';

@Component({
    selector: 'app',
    templateUrl: 'client.html'
})
export class ClientComponent implements OnInit{
    @Input() gridData: Array<MobileCliente>;
    @Input() proyectos: Array<MobileProyecto>;

    //grid
    public formGroup: FormGroup;
    private editedRowIndex: number;
    public idEdited: number;
    private idAdmin: number;


    constructor(private servicio: CRUDService, private router: Router){
        //servicio.urlRequest = environment.urlClients;
        this.idAdmin = Number( sessionStorage.getItem('idAdmin') );
    }


    public ngOnInit(): void{
       //lista de proyectos
       this.servicio.urlRequest = environment.urlProjects;
       this.getListProyectos();
       
       //lista de clientes
       this.servicio.urlRequest = environment.urlClients;
       this.getList();
    }

  
    /***************************************************************************/
    //buttons actions 
    protected addHandler({sender}) {
      this.closeEditor(sender);

      this.formGroup = new FormGroup({
          //'idCliente': new FormControl(0),
          'idProyecto': new FormControl(0),
          'codigoCliente': new FormControl(""),
          'nombreCliente': new FormControl(""),
          'activo': new FormControl(true)
      });
      sender.addRow(this.formGroup);
    }

    protected editHandler({sender, rowIndex, dataItem}) {
      this.closeEditor(sender);

      let controlId = new FormControl(dataItem.idCliente);
      controlId.disable();
      this.idEdited = dataItem.idCliente;
      this.formGroup = new FormGroup({
          'idCliente': controlId,
          'idProyecto': new FormControl(dataItem.idProyecto, Validators.required),
          'codigoCliente': new FormControl(dataItem.codigoCliente),
          'nombreCliente': new FormControl(dataItem.nombreCliente),
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
      let uri  = environment.urlClientsFilter + "/" + this.idAdmin;
      let url = this.servicio.getUrl(uri);

      this.servicio.getList(url).subscribe(data => {
        this.gridData = data;
      }, e => {
        sessionStorage.removeItem('token');
        this.router.navigate(['/login']);
      });

    }

    protected saveHandler({sender, rowIndex, formGroup, isNew}) {
      const dataItem: MobileCliente = formGroup.value;
      
      if(isNew){
        this.servicio.add(dataItem).subscribe(data => {
          this.gridData.push(data);
        }, e =>{
              sessionStorage.removeItem("token");
              this.router.navigate(["/login"]);
        });
      }else{
        dataItem.idCliente = this.idEdited;
        this.servicio.update(dataItem, dataItem.idCliente).subscribe(data => {
            this.getList();
        }, e =>{
            sessionStorage.removeItem("token");
            this.router.navigate(["/login"]);
        });
      }

      sender.closeRow(rowIndex);
    }

    protected removeHandler({dataItem}) {
        this.servicio.delete(dataItem, dataItem.idCliente).subscribe(data => {
            this.getList();
        }, e =>{
            sessionStorage.removeItem("token");
            this.router.navigate(["/login"]);
        });
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
      if(this.proyectos!=null){
        if(this.proyectos.length>0){
          return this.proyectos.find(x => x.idProyecto === id);
        }else{
          return new MobileProyecto(0, "");
        }
      }
    }
    
    /***************************************************************************/

}
