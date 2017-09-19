import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MobileAdmin } from '../../Classes/MobileAdmin';
import { MobileRolAdmin } from '../../Classes/MobileRolAdmin';
import { Router } from '@angular/router';
import { CRUDService } from '../../Services/CRUDService/CRUDService';
import { environment } from '../../../environments/environment';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';

@Component({
    selector: 'app',
    templateUrl: 'admin.html'
})
export class AdminComponent implements OnInit{
    @Input() gridData: Array<MobileAdmin>;
    @Input() roles: Array<MobileRolAdmin>;

    //grid
    public formGroup: FormGroup;
    private editedRowIndex: number;
    public idEdited: number;
    private idAdmin: number;


    constructor(private servicio: CRUDService, private router: Router){
        this.idAdmin = Number( sessionStorage.getItem('idAdmin') );
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
          //'idAplicacion': new FormControl(0),
          'nombreAdmin': new FormControl("", Validators.required),
          'email': new FormControl("", Validators.required),
          'idRolAdmin': new FormControl("", Validators.required),
          'password': new FormControl("", Validators.required)
      });
      sender.addRow(this.formGroup);
    }

    protected editHandler({sender, rowIndex, dataItem}) {
      this.closeEditor(sender);


      let controlId = new FormControl(dataItem.idAdmin);
      controlId.disable();
      this.idEdited = dataItem.idAdmin;
      this.formGroup = new FormGroup({
        'idAdmin': controlId,
        'nombreAdmin': new FormControl(dataItem.nombreAdmin, Validators.required),
        'email': new FormControl(dataItem.email, Validators.required),
        'idRolAdmin': new FormControl(dataItem.idRolAdmin, Validators.required),
        'password': new FormControl(dataItem.password)
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
        this.servicio.add(dataItem).subscribe(data => {
          this.gridData.push(data);
        }, e =>{
              sessionStorage.removeItem("token");
              this.router.navigate(["/login"]);
        });
      }else{
        dataItem.idAdmin = this.idEdited;

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
        this.servicio.delete(dataItem, dataItem.idAdmin).subscribe(data => {
            this.getList();
        }, e =>{
            sessionStorage.removeItem("token");
            this.router.navigate(["/login"]);
        });
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
    /***************************************************************************/

}
