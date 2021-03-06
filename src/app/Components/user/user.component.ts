import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MobileUsuario } from '../../Classes/MobileUsuario';
import { MobileCliente } from '../../Classes/MobileCliente';
import { Router } from '@angular/router';
import { CRUDService } from '../../Services/CRUDService/CRUDService';
import { environment } from '../../../environments/environment';
import { GridComponent, GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { State, process } from '@progress/kendo-data-query';
import { ModalConfirmComponent } from '../modal/confirm-modal.component';
import { ModalFileComponent } from '../modal/file-modal.component';
import { ModalOkComponent } from '../modal/ok-modal.component';

import { SHA1 } from 'crypto-js';
import { validateConfig } from '@angular/router/src/config';

@Component({
    selector: 'app',
    templateUrl: 'user.component.html'
})
export class UserComponent implements OnInit{
    @Input() usuarios = new Array<MobileUsuario>();
    @Input() clientes: Array<MobileCliente>;
    @ViewChild('confirmModal')
    public confirmModal: ModalConfirmComponent;
    @ViewChild('fileModal')
    public modalFile: ModalFileComponent;
    public confirmModalTitle: string = "Eliminar aplicacion";
    public confirmModalMessage: string = "¿Seguro que desea eliminar el registro?";
    @ViewChild('okModal')
    public okModal: ModalOkComponent;

    //grid
    public formGroup: FormGroup;
    public editedRowIndex: number;
    public idEdited: number;
    public passEdited: string;
    public idAdmin: number;
    public dataRemove: any;


    public state: State = {
        skip: 0,
        take: 12
    };
    public gridData: GridDataResult = process(this.usuarios, this.state);

    public dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridData = process(this.usuarios, this.state);
    }


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
    public addHandler({sender}) {
      this.closeEditor(sender);

      this.formGroup = new FormGroup({
          'idCliente': new FormControl(1),
          'codigoUsuario': new FormControl("", Validators.required),
          'codigoCliente': new FormControl(""),
          'nombreUsuario': new FormControl("", Validators.required),
          'email': new FormControl("", Validators.required),
          'password': new FormControl("", Validators.required),
          'activo': new FormControl(true, Validators.required)
      });
      sender.addRow(this.formGroup);
    }

    public editHandler({sender, rowIndex, dataItem}) {
      this.closeEditor(sender);

      this.idEdited = dataItem.idUsuario;
      this.passEdited = dataItem.password;
      this.formGroup = new FormGroup({
        'idCliente': new FormControl(dataItem.idCliente, Validators.required),
        'codigoUsuario': new FormControl(dataItem.codigoUsuario, Validators.required),
        'codigoCliente': new FormControl(dataItem.codigoCliente),
        'nombreUsuario': new FormControl(dataItem.nombreUsuario, Validators.required),
        'email': new FormControl(dataItem.email, Validators.required),
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
      let uri  = environment.urlUsersFilter + "/" + this.idAdmin;
      let url = this.servicio.getUrl(uri);

      this.servicio.getList(url).subscribe(data => {
        this.usuarios = data;
        this.gridData = process(this.usuarios, this.state);
      }, e => {
        sessionStorage.removeItem('token');
        this.router.navigate(['/login']);
      });

    }

    public saveHandler({sender, rowIndex, formGroup, isNew}) {
      const dataItem: MobileUsuario = formGroup.value;

      if(isNew){
        dataItem.password = SHA1(dataItem.password).toString();

        this.servicio.add(dataItem).subscribe(data => {
          this.usuarios.push(data);
          this.gridData = process(this.usuarios, this.state);
        }, e =>{
              sessionStorage.removeItem("token");
              this.router.navigate(["/login"]);
        });
      }else{
        dataItem.idUsuario = this.idEdited;
        dataItem.password = this.passEdited;
        
        this.servicio.update(dataItem, dataItem.idUsuario).subscribe(data => {
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
        this.servicio.delete(this.dataRemove.idUsuario).subscribe(data => {
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
          this.gridData = process(this.usuarios.filter(item => item.idCliente == idCliente), this.state);
        }else{
          this.gridData = process(this.usuarios, this.state);
        }
    }


    public showAsterisk()
    {
        return "********";
    }
    
    /***************************************************************************/

    /***************************************************************************/
    //subida masiva
    public showModalFile(){
      this.modalFile.modal.open();
    }

    public ProcessFileClient(text: Array<string>){
      let users = new Array<MobileUsuario>();

      for(let x = 1; x < text.length; x++){
        let campos = text[x].split(";");
        let codigoUsuario = campos[0];
        let codigoCliente = campos[1];
        let nombreUsuario = campos[2];
        let email = campos[3];
        let password = SHA1(campos[4]).toString().trim();

        let user = new MobileUsuario(0, 0, codigoUsuario, codigoCliente, nombreUsuario, email, password, true);
        users.push(user);
      }

      this.SendUsersList(users);

    }

    public SendUsersList(users: Array<MobileUsuario>){
      let uri  = environment.urlUsers + "/sincronizacion";
      let url = this.servicio.getUrl(uri);

      this.servicio.add(users, url).subscribe(data => {
        console.log("SendUsersList subscribe: " + data );
          this.getList();
          this.modalFile.modal.close();
          this.okModal.modal.open();
      }, e =>{
          sessionStorage.removeItem("token");
          this.router.navigate(["/login"]);
      });
    }
    /***************************************************************************/


}
