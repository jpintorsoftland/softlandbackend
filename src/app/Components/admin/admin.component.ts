import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MobileAdmin } from '../../Classes/MobileAdmin';
import { MobileRolAdmin } from '../../Classes/MobileRolAdmin';
import { Router } from '@angular/router';
import { CRUDService } from '../../Services/CRUDService/CRUDService';
import { environment } from '../../../environments/environment';
import { GridComponent, GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { ModalConfirmComponent } from '../modal/confirm-modal.component';

import { SHA1 } from 'crypto-js';

@Component({
    selector: 'app',
    templateUrl: 'admin.component.html'
})
export class AdminComponent implements OnInit{
    @Input() administradores = new Array<MobileAdmin>();
    @Input() roles = Array<MobileRolAdmin>();
    @ViewChild('confirmModal')
    public confirmModal: ModalConfirmComponent;
    public confirmModalTitle: string = "Eliminar administrador";
    public confirmModalMessage: string = "¿Seguro que desea eliminar el registro?";

    //grid
    public formGroup: FormGroup;
    private editedRowIndex: number;
    private idAdmin: number;
    public idEdited: number;
    public passEdited: string;
    public activoEdited: boolean;
    public dataRemove: any;
    public visibleForm: boolean;


    public state: State = {
        skip: 0,
        take: 12
    };
    public gridData: GridDataResult = process(this.administradores, this.state);

    public dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridData = process(this.administradores, this.state);
    }



    constructor(private servicio: CRUDService, private router: Router){
        this.idAdmin = Number( sessionStorage.getItem('idAdmin') );
        sessionStorage.setItem("idAdminSelected", null);
        sessionStorage.setItem("nombreAdminSelected", null);
        this.visibleForm = true;
    }


    public ngOnInit(): void{
      //lista de roles
      this.servicio.urlRequest = environment.urlRoles;
      this.getListRoles();

      //lista de admins
      this.servicio.urlRequest = environment.urlAdmins;
      this.getList();
    }

  
    /***************************************************************************/
    //buttons actions 
    public addHandler({sender}) {
      this.closeEditor(sender);

      this.formGroup = new FormGroup({
          'nombreAdmin': new FormControl("", Validators.required),
          'email': new FormControl("", Validators.required),
          'idRolAdmin': new FormControl(1, Validators.required),
          'password': new FormControl("", Validators.required)
      });
      sender.addRow(this.formGroup);
    }

    public editHandler({sender, rowIndex, dataItem}) {
      this.closeEditor(sender);

      this.idEdited = dataItem.idAdmin;
      this.passEdited = dataItem.password;
      this.activoEdited = dataItem.activo;

      console.log("editHandler password " + dataItem.password);
      
      this.formGroup = new FormGroup({
        'nombreAdmin': new FormControl(dataItem.nombreAdmin, Validators.required),
        'email': new FormControl(dataItem.email, Validators.required),
        'idRolAdmin': new FormControl(dataItem.idRolAdmin, Validators.required)
      });

      this.editedRowIndex = rowIndex;

      sender.editRow(rowIndex, this.formGroup);
  
    }
    

    public cancelHandler({sender, rowIndex}) {
      this.closeEditor(sender, rowIndex);
      this.visibleForm = true;
    }

    public closeEditor(grid, rowIndex = this.editedRowIndex) {
      this.visibleForm = false;
      grid.closeRow(rowIndex);
      this.editedRowIndex = undefined;
      this.formGroup = undefined;
    }
    /***************************************************************************/
    


    /***************************************************************************/
    //api actions
    public getList(): void{
      let uri  = environment.urlAdminsFilter + "/" + this.idAdmin;
      let url = this.servicio.getUrl(uri);

      this.servicio.getList(url).subscribe(data => {
        this.administradores = data;
        this.gridData = process(this.administradores, this.state);
      }, e => {
        sessionStorage.removeItem('token');
        this.router.navigate(['/login']);
      });

    }

    public saveHandler({sender, rowIndex, formGroup, isNew}) {

      const dataItem: MobileAdmin = formGroup.value;

      if(isNew){
        dataItem.password = SHA1(dataItem.password).toString();

        this.servicio.add(dataItem).subscribe(data => {
          this.administradores.push(data);
          this.gridData = process(this.administradores, this.state);
        }, e =>{
              sessionStorage.removeItem("token");
              this.router.navigate(["/login"]);
        });
      }else{
        dataItem.idAdmin = this.idEdited;
        dataItem.password = this.passEdited;
        dataItem.activo = this.activoEdited;

        this.servicio.update(dataItem, dataItem.idAdmin).subscribe(data => {
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
        this.servicio.delete(this.dataRemove.idAdmin).subscribe(data => {
            this.getList();
            this.confirmModal.modal.close();
        }, e =>{
            sessionStorage.removeItem("token");
            this.router.navigate(["/login"]);
        });
      }
    }


    public getListRoles(): void{
      this.servicio.getList().subscribe(data => {
        this.roles = data;
      }, e => {
        sessionStorage.removeItem('token');
        this.router.navigate(['/login']);
      });

    }

    public buscarRoles(id: number): any{
      if(this.roles!=null){

        if(this.roles.length>0){
          return this.roles.find(x => x.idRolAdmin === id);
        }else{
          return new MobileRolAdmin(0, "", 0);
        }
      }
    }
    
    public filtroRol(idRol: Number){
        if(idRol){
          this.gridData = process(this.administradores.filter(item => item.idRolAdmin == idRol), this.state);
        }else{
          this.gridData = process(this.administradores, this.state);
        }
    }


    public asignClients(dataItem)
    {
      sessionStorage.setItem("idAdminSelected", dataItem.idAdmin);
      sessionStorage.setItem("nombreAdminSelected", dataItem.nombreAdmin);
      this.router.navigate(['/administradores/clientes']);
    }

    public isSuperAdmin(dataItem): boolean
    {
      if(dataItem.idRolAdmin==1){
        return true;
      }else{
        return false;
      }
    }
    /***************************************************************************/


    public showAsterisk()
    {
        return "********";
    }
  

}
