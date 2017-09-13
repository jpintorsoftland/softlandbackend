import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MobileAdmin } from '../../Classes/MobileAdmin';
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

    //grid
    public formGroup: FormGroup;
    private editedRowIndex: number;


    constructor(private servicio: CRUDService, private router: Router){
        servicio.urlRequest = environment.urlAdmins;
    }


    public ngOnInit(): void{
      this.getList();
    }

  
    /***************************************************************************/
    //buttons actions 
    protected addHandler({sender}) {
      this.closeEditor(sender);

      this.formGroup = new FormGroup({
          //'idAplicacion': new FormControl(0),
          'nombreAdmin': new FormControl("", Validators.required),
          'email': new FormControl("", Validators.required)
      });
      sender.addRow(this.formGroup);
    }

    protected editHandler({sender, rowIndex, dataItem}) {
      this.closeEditor(sender);

      let controlId = new FormControl(dataItem.idAdmin);
      //controlId.disable();
      this.formGroup = new FormGroup({
          'idAdmin': controlId,
          'nombreAdmin': new FormControl(dataItem.nombreAdmin, Validators.required),
          'email': new FormControl(dataItem.nombreAdmin, Validators.required)
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
      const dataItem: MobileAdmin = formGroup.value;

      if(isNew){
        this.servicio.add(dataItem).subscribe(data => {
          this.gridData.push(data);
        }, e =>{
              sessionStorage.removeItem("token");
              this.router.navigate(["/login"]);
        });
      }else{
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
    /***************************************************************************/

}
