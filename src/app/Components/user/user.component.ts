import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MobileUsuario } from '../../Classes/MobileUsuario';
import { MobileCliente } from '../../Classes/MobileCliente';
import { Router } from '@angular/router';
import { CRUDService } from '../../Services/CRUDService/CRUDService';
import { environment } from '../../../environments/environment';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { State, process } from '@progress/kendo-data-query';


@Component({
    selector: 'app',
    templateUrl: 'user.html'
})
export class UserComponent implements OnInit{
    @Input() gridData: Array<MobileUsuario>;
    @Input() clientes: Array<MobileCliente>;

    //grid
    public formGroup: FormGroup;
    private editedRowIndex: number;
    public idEdited: number;


    constructor(private servicio: CRUDService, private router: Router){
        //servicio.urlRequest = environment.urlUsers;
    }

    public ngOnInit(): void{
      //lista de clientes
      this.servicio.urlRequest = environment.urlClients;
      this.getListClientes();
      
      this.servicio.urlRequest = environment.urlUsers;
      //lista de usuarios
      this.getList();
    }

  
    /***************************************************************************/
    //buttons actions 
    protected addHandler({sender}) {
      this.closeEditor(sender);

      this.formGroup = new FormGroup({
          //'idUsuario': new FormControl(0),
          'idCliente': new FormControl(1),
          'codigoUsuario': new FormControl(""),
          'codigoCliente': new FormControl(""),
          'nombreUsuario': new FormControl(""),
          'email': new FormControl(""),
          'activo': new FormControl(true)
      });
      sender.addRow(this.formGroup);
    }

    protected editHandler({sender, rowIndex, dataItem}) {
      this.closeEditor(sender);

      
      let controlId = new FormControl(dataItem.idUsuario);
      controlId.disable();
      this.idEdited = dataItem.idUsuario;
      this.formGroup = new FormGroup({
        'idUsuario': new FormControl(dataItem.idUsuario),
        'idCliente': new FormControl(dataItem.idCliente),
        'codigoUsuario': new FormControl(dataItem.codigoUsuario),
        'codigoCliente': new FormControl(dataItem.codigoCliente),
        'nombreUsuario': new FormControl(dataItem.nombreUsuario),
        'email': new FormControl(dataItem.email),
        'activo': new FormControl(dataItem.activo)
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
      const dataItem: MobileUsuario = formGroup.value;

      if(isNew){
        this.servicio.add(dataItem).subscribe(data => {
          this.gridData.push(data);
        }, e =>{
              sessionStorage.removeItem("token");
              this.router.navigate(["/login"]);
        });
      }else{
        dataItem.idUsuario = this.idEdited;
        this.servicio.update(dataItem, dataItem.idUsuario).subscribe(data => {
            this.getList();
        }, e =>{
            sessionStorage.removeItem("token");
            this.router.navigate(["/login"]);
        });
      }

      sender.closeRow(rowIndex);
    }

    protected removeHandler({dataItem}) {
        this.servicio.delete(dataItem, dataItem.idUsuario).subscribe(data => {
            this.getList();
        }, e =>{
            sessionStorage.removeItem("token");
            this.router.navigate(["/login"]);
        });
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
