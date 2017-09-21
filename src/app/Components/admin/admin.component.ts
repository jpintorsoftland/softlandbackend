import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MobileAdmin } from '../../Classes/MobileAdmin';
import { MobileRolAdmin } from '../../Classes/MobileRolAdmin';
import { Router } from '@angular/router';
import { CRUDService } from '../../Services/CRUDService/CRUDService';
import { environment } from '../../../environments/environment';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

import { SHA1 } from 'crypto-js';

@Component({
    selector: 'app',
    templateUrl: 'admin.html'
})
export class AdminComponent implements OnInit{
    @Input() gridData: Array<MobileAdmin>;
    @Input() roles: Array<MobileRolAdmin>;
    @ViewChild('modal')
    public modal: ModalComponent;

    //grid
    public formGroup: FormGroup;
    private editedRowIndex: number;
    private idAdmin: number;
    public idEdited: number;
    public passEdited: string;
    public activoEdited: boolean;
    public dataRemove: any;
    public visibleForm: boolean;


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
    protected addHandler({sender}) {
      this.closeEditor(sender);

      this.formGroup = new FormGroup({
          'nombreAdmin': new FormControl("", Validators.required),
          'email': new FormControl("", Validators.required),
          'idRolAdmin': new FormControl(1, Validators.required),
          'password': new FormControl("", Validators.required)
      });
      sender.addRow(this.formGroup);
    }

    protected editHandler({sender, rowIndex, dataItem}) {
      this.closeEditor(sender);

      this.idEdited = dataItem.idAdmin;
      this.passEdited = dataItem.password;
      this.activoEdited = dataItem.activo;
      
      this.formGroup = new FormGroup({
        'nombreAdmin': new FormControl(dataItem.nombreAdmin, Validators.required),
        'email': new FormControl(dataItem.email, Validators.required),
        'idRolAdmin': new FormControl(dataItem.idRolAdmin, Validators.required)
      });

      this.editedRowIndex = rowIndex;

      sender.editRow(rowIndex, this.formGroup);
  
    }
    

    protected cancelHandler({sender, rowIndex}) {
      this.closeEditor(sender, rowIndex);
      this.visibleForm = true;
    }

    private closeEditor(grid, rowIndex = this.editedRowIndex) {
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
        this.gridData = data;
      }, e => {
        sessionStorage.removeItem('token');
        this.router.navigate(['/login']);
      });

    }

    protected saveHandler({sender, rowIndex, formGroup, isNew}) {
      const dataItem: MobileAdmin = formGroup.value;

      if(isNew){
        dataItem.password = SHA1(dataItem.password).toString();

        this.servicio.add(dataItem).subscribe(data => {
          this.gridData.push(data);
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

    protected removeHandler({dataItem}) {
      this.dataRemove = dataItem;
      this.modal.open();
    }

    public remove(){
      if(this.dataRemove){
        this.servicio.delete(this.dataRemove.idAdmin).subscribe(data => {
            this.getList();
            this.modal.close();
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
