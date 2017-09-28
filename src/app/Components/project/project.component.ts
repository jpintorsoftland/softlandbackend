import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MobileProyecto } from '../../Classes/MobileProyecto';
import { Router } from '@angular/router';
import { CRUDService } from '../../Services/CRUDService/CRUDService';
import { environment } from '../../../environments/environment';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { ModalConfirmComponent } from '../modal/confirm-modal';

@Component({
    selector: 'app',
    templateUrl: 'project.html'
})
export class ProjectComponent implements OnInit{
    @Input() gridData: Array<MobileProyecto>;
    @ViewChild('confirmModal')
    public confirmModal: ModalConfirmComponent;
    public confirmModalTitle: string = "Eliminar aplicacion";
    public confirmModalMessage: string = "¿Seguro que desea eliminar el registro?";

    //grid
    public formGroup: FormGroup;
    private editedRowIndex: number;
    public idEdited: number;
    public dataRemove: any;


    constructor(private servicio: CRUDService, private router: Router){
        servicio.urlRequest = environment.urlProjects;
    }


    public ngOnInit(): void{
      this.getList();
    }

  
    /***************************************************************************/
    //buttons actions 
    protected addHandler({sender}) {
      this.closeEditor(sender);

      this.formGroup = new FormGroup({
          //'idProyecto': new FormControl(0),
          'descripcion': new FormControl("", Validators.required)
      });
      sender.addRow(this.formGroup);
    }

    protected editHandler({sender, rowIndex, dataItem}) {
      this.closeEditor(sender);

      this.idEdited = dataItem.idProyecto;

      this.formGroup = new FormGroup({
          'descripcion': new FormControl(dataItem.descripcion, Validators.required)
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
      const dataItem: MobileProyecto = formGroup.value;

      if(isNew){
        this.servicio.add(dataItem).subscribe(data => {
          this.gridData.push(data);
        }, e =>{
              sessionStorage.removeItem("token");
              this.router.navigate(["/login"]);
        });
      }else{
        dataItem.idProyecto = this.idEdited;
        this.servicio.update(dataItem, dataItem.idProyecto).subscribe(data => {
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

    protected remove() {
      if(this.dataRemove){
        this.servicio.delete(this.dataRemove.idProyecto).subscribe(data => {
            this.getList();
            this.confirmModal.modal.close();
        }, e =>{
            sessionStorage.removeItem("token");
            this.router.navigate(["/login"]);
        });

      }
    }
    /***************************************************************************/

}
