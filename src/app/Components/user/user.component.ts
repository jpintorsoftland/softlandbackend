import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MobileUsuario } from '../../Classes/MobileUsuario';
import { MobileCliente } from '../../Classes/MobileCliente';
import { Router } from '@angular/router';
import { CRUDService } from '../../Services/CRUDService/CRUDService';
import { environment } from '../../../environments/environment';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { State, process } from '@progress/kendo-data-query';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

import { SHA1 } from 'crypto-js';

@Component({
    selector: 'app',
    templateUrl: 'user.html'
})
export class UserComponent implements OnInit{
    @Input() gridData: Array<MobileUsuario>;
    @Input() clientes: Array<MobileCliente>;
    @ViewChild('modal')
    public modal: ModalComponent;

    //grid
    public formGroup: FormGroup;
    private editedRowIndex: number;
    public idEdited: number;
    private idAdmin: number;
    public dataRemove: any;


    constructor(private servicio: CRUDService, private router: Router){
        //servicio.urlRequest = environment.urlUsers;
        this.idAdmin = Number( sessionStorage.getItem('idAdmin') );
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
          'idCliente': new FormControl(1),
          'codigoUsuario': new FormControl(""),
          'codigoCliente': new FormControl(""),
          'nombreUsuario': new FormControl(""),
          'email': new FormControl(""),
          'password': new FormControl(""),
          'activo': new FormControl(true)
      });
      sender.addRow(this.formGroup);
    }

    protected editHandler({sender, rowIndex, dataItem}) {
      this.closeEditor(sender);

      this.idEdited = dataItem.idUsuario;
      this.formGroup = new FormGroup({
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
      let uri  = environment.urlUsersFilter + "/" + this.idAdmin;
      let url = this.servicio.getUrl(uri);

      this.servicio.getList(url).subscribe(data => {
        this.gridData = data;
      }, e => {
        sessionStorage.removeItem('token');
        this.router.navigate(['/login']);
      });

    }

    protected saveHandler({sender, rowIndex, formGroup, isNew}) {
      const dataItem: MobileUsuario = formGroup.value;

      if(isNew){
        dataItem.password = SHA1(dataItem.password).toString();

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
      this.dataRemove = dataItem;
      this.modal.open();
    }

    public remove(){
      if(this.dataRemove){
        this.servicio.delete(this.dataRemove, this.dataRemove.idUsuario).subscribe(data => {
            this.getList();
            this.modal.close();
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

    public showAsterisk()
    {
        return "********";
    }
    
    /***************************************************************************/

}
