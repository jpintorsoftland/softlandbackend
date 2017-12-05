import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MobileAplicacion } from '../../Classes/MobileAplicacion';
import { Router } from '@angular/router';
import { CRUDService } from '../../Services/CRUDService/CRUDService';
import { environment } from '../../../environments/environment';
import { GridComponent, GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { ModalConfirmComponent } from '../modal/confirm-modal.component';

@Component({
    selector: 'app',
    templateUrl: 'application.component.html'
})
export class ApplicationComponent implements OnInit{
    @Input() aplicaciones = new Array<MobileAplicacion>();
    @ViewChild('confirmModal')
    public confirmModal: ModalConfirmComponent;
    public confirmModalTitle: string = "Eliminar aplicación";
    public confirmModalMessage: string = "¿Seguro que desea eliminar el registro?";

    //grid
    public formGroup: FormGroup;
    public editedRowIndex: number;
    public idEdited: number;
    public dataRemove: any;


    public state: State = {
      skip: 0,
      take: 12
    };
    public gridData: GridDataResult = process(this.aplicaciones, this.state);

    public dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridData = process(this.aplicaciones, this.state);
    }


    constructor(private servicio: CRUDService, private router: Router){
        servicio.urlRequest = environment.urlApps;
    }


    public ngOnInit(): void{
      this.getList();
    }

  
    /***************************************************************************/
    //buttons actions 
    public addHandler({sender}) {
      this.closeEditor(sender);

      this.formGroup = new FormGroup({
          //'idAplicacion': new FormControl(0),
          'descripcion': new FormControl("", Validators.required)
      });
      sender.addRow(this.formGroup);
    }

    public editHandler({sender, rowIndex, dataItem}) {
      this.closeEditor(sender);

      this.idEdited = dataItem.idAplicacion;
      this.formGroup = new FormGroup({
          'descripcion': new FormControl(dataItem.descripcion, Validators.required)
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
      this.servicio.getList().subscribe(data => {
        this.aplicaciones = data;
        this.gridData = process(this.aplicaciones, this.state);
      }, e => {
        sessionStorage.removeItem('token');
        this.router.navigate(['/login']);
      });

    }

    public saveHandler({sender, rowIndex, formGroup, isNew}) {
      const dataItem: MobileAplicacion = formGroup.value;

      if(isNew){
        this.servicio.add(dataItem).subscribe(data => {
          this.aplicaciones.push(data);
          this.gridData = process(this.aplicaciones, this.state);
        }, e =>{
              sessionStorage.removeItem("token");
              this.router.navigate(["/login"]);
        });
      }else{
        dataItem.idAplicacion = this.idEdited;
        this.servicio.update(dataItem, dataItem.idAplicacion).subscribe(data => {
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


    public remove() {
      if(this.dataRemove){
        this.servicio.delete(this.dataRemove.idAplicacion).subscribe(data => {
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
