import { MobileModulo } from './../../Classes/MobileModulo';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CRUDService } from '../../Services/CRUDService/CRUDService';
import { environment } from '../../../environments/environment';
import { GridComponent, GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { ModalConfirmComponent } from '../modal/confirm-modal.component';

@Component({
    selector: 'app',
    templateUrl: 'module.component.html'
})
export class ModuleComponent {
    @Input() modulos = new Array<MobileModulo>();
    @ViewChild('confirmModal')
    public confirmModal: ModalConfirmComponent;
    public confirmModalTitle: string = "Eliminar aplicacion";
    public confirmModalMessage: string = "¿Seguro que desea eliminar el registro?";

    //grid
    public formGroup: FormGroup;
    public editedRowIndex: number;
    public idEdited: number;
    public activoEdited: boolean;
    public dataRemove: any;

    public state: State = {
      skip: 0,
      take: 12
    };
    public gridData: GridDataResult = process(this.modulos, this.state);

    public dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridData = process(this.modulos, this.state);
    }


    constructor(private servicio: CRUDService, private router: Router){
        servicio.urlRequest = environment.urlModules;
    }


    public ngOnInit(): void{
      this.getList();
    }

  
    /***************************************************************************/
    //buttons actions 
    public addHandler({sender}) {
      this.closeEditor(sender);

      this.formGroup = new FormGroup({
          'descripcion': new FormControl("", Validators.required),
          'activo': new FormControl(true, Validators.required)
      });
      sender.addRow(this.formGroup);
    }

    public editHandler({sender, rowIndex, dataItem}) {
      this.closeEditor(sender);

      this.idEdited = dataItem.idModulo;
      this.formGroup = new FormGroup({
          'descripcion': new FormControl(dataItem.descripcion, Validators.required),
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
      this.servicio.getList().subscribe(data => {
        this.modulos = data;
        this.gridData = process(this.modulos, this.state);
      }, e => {
        sessionStorage.removeItem('token');
        this.router.navigate(['/login']);
      });

    }

    public saveHandler({sender, rowIndex, formGroup, isNew}) {
      const dataItem: MobileModulo = formGroup.value;

      if(isNew){
        this.servicio.add(dataItem).subscribe(data => {
          this.modulos.push(data);
          this.gridData = process(this.modulos, this.state);
        }, e =>{
              sessionStorage.removeItem("token");
              this.router.navigate(["/login"]);
        });
      }else{
        dataItem.idModulo = this.idEdited;
        this.servicio.update(dataItem, dataItem.idModulo).subscribe(data => {
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
        this.servicio.delete(this.dataRemove.idModulo).subscribe(data => {
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

