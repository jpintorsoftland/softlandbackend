import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MobileInstancia } from '../../Classes/MobileInstancia';
import { MobileCliente } from '../../Classes/MobileCliente';
import { MobileProyecto } from '../../Classes/MobileProyecto';
import { Router } from '@angular/router';
import { CRUDService } from '../../Services/CRUDService/CRUDService';
import { environment } from '../../../environments/environment';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';

@Component({
    selector: 'app',
    templateUrl: 'instance.html'
})
export class InstanceComponent implements OnInit{
    @Input() gridData: Array<MobileInstancia>;
    @Input() proyectos: Array<MobileProyecto>;
    @Input() clientes: Array<MobileCliente>;

    //grid
    public formGroup: FormGroup;
    private editedRowIndex: number;
    public idEdited: number;


    constructor(private servicio: CRUDService, private router: Router){
      
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
          //'idInstancia': new FormControl(0),
          'idCliente': new FormControl("", Validators.required),
          'idProyecto': new FormControl("", Validators.required),
          'codigoInstancia': new FormControl("", Validators.required),
          'codigoCliente': new FormControl("", Validators.required),
          'nombreInstancia': new FormControl("", Validators.required),
          'activo': new FormControl(true)
      });
      sender.addRow(this.formGroup);
    }

    protected editHandler({sender, rowIndex, dataItem}) {
      this.closeEditor(sender);

      let controlId = new FormControl(dataItem.idInstancia);
      controlId.disable();
      this.idEdited = dataItem.idInstancia;
      this.formGroup = new FormGroup({
          'idInstancia': controlId,
          'idCliente': new FormControl(dataItem.idCliente, Validators.required),
          'idProyecto': new FormControl(dataItem.idProyecto, Validators.required),
          'codigoInstancia': new FormControl(dataItem.codigoInstancia, Validators.required),
          'codigoCliente': new FormControl(dataItem.codigoCliente, Validators.required),
          'nombreInstancia': new FormControl(dataItem.nombreInstancia, Validators.required),
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
      this.servicio.getList().subscribe(data => {
        this.gridData = data;
      }, e => {
        sessionStorage.removeItem('token');
        this.router.navigate(['/login']);
      });

    }

    protected saveHandler({sender, rowIndex, formGroup, isNew}) {
      const dataItem: MobileInstancia = formGroup.value;

      if(isNew){
        this.servicio.add(dataItem).subscribe(data => {
          this.gridData.push(data);
        }, e =>{
              sessionStorage.removeItem("token");
              this.router.navigate(["/login"]);
        });
      }else{
        dataItem.idInstancia = this.idEdited;
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
        this.servicio.delete(dataItem, dataItem.idInstancia).subscribe(data => {
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
      if(this.proyectos){
        if(this.proyectos.length>0){
          let proyecto = this.proyectos.find(x => x.idProyecto === id);
          return proyecto;
        }else{
          return new MobileProyecto(0, "");
        }
      }
    }

    public getListClientes(): void{
      this.servicio.getList().subscribe(data => {
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
    /***************************************************************************/

}
