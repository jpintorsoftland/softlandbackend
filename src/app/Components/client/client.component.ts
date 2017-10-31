import { Component, OnInit, Input, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MobileCliente } from '../../Classes/MobileCliente';
import { MobileProyecto } from '../../Classes/MobileProyecto';
import { MobileAdminClientes } from './../../Classes/MobileAdminClientes';
import { MobileResultadoSincronizacion } from './../../Classes/MobileResultadoSincronizacion';
import { Router } from '@angular/router';
import { CRUDService } from '../../Services/CRUDService/CRUDService';
import { environment } from '../../../environments/environment';
import { GridComponent, GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { FileRestrictions, SelectEvent, ClearEvent, RemoveEvent } from '@progress/kendo-angular-upload';
import { ModalConfirmComponent } from '../modal/confirm-modal.component';
import { ModalFileComponent } from '../modal/file-modal.component';
 
const distinct = data => data
  .map(x => x.MobileProyecto)
  .filter((x, idx, xs) => xs.findIndex(y => y.descripcion === x.descripcion) === idx);


@Component({
    selector: 'app',
    templateUrl: 'client.component.html'
})
export class ClientComponent implements OnInit{
    @Input() clientes = new Array<MobileCliente>();
    @Input() proyectos: Array<MobileProyecto>;
    @ViewChild('confirmModal')
    public confirmModal: ModalConfirmComponent;
    @ViewChild('fileModal')
    public modalFile: ModalFileComponent;
    public confirmModalTitle: string = "Eliminar cliente";
    public confirmModalMessage: string = "¿Seguro que desea eliminar el registro?";

    //grid
    public formGroup: FormGroup;
    private editedRowIndex: number;
    public idEdited: number;
    private idAdmin: number;
    private idRolAdmin: number;
    public dataRemove: any;
    public visibleArchivo: boolean;
    public visibleSubir: boolean;

    //upload
    public uploadSaveUrl: string = "../../../assets/uploads";
    public uploadRemoveUrl: string = "removeUrl";
    public uploadRestriction: FileRestrictions = {
      allowedExtensions: [".csv"]
    };
  
    public clearEventHandler(e: ClearEvent): void {
      console.log("Clearing the file upload");
    }
  
    public completeEventHandler() {
      console.log("All files processed");
    }
    

    private state: State = {
      skip: 0,
      take: 12
    };
    private gridData: GridDataResult = process(this.clientes, this.state);

    protected dataStateChange(state: DataStateChangeEvent): void {
        this.state = state;
        this.gridData = process(this.clientes, this.state);
    }



    constructor(private servicio: CRUDService, private router: Router){
        //servicio.urlRequest = environment.urlClients;
        this.idAdmin = Number( sessionStorage.getItem('idAdmin') );
        this.idRolAdmin = Number( sessionStorage.getItem('idRolAdmin') );
    }


    public ngOnInit(): void{
       //lista de proyectos
       this.servicio.urlRequest = environment.urlProjects;
       this.getListProyectos();
       
       //lista de clientes
       this.servicio.urlRequest = environment.urlClients;
       this.getList();
    }

  
    /***************************************************************************/
    //buttons actions 
    protected addHandler({sender}) {
      this.closeEditor(sender);

      this.formGroup = new FormGroup({
          //'idCliente': new FormControl(0),
          'idProyecto': new FormControl(0),
          'codigoCliente': new FormControl(""),
          'nombreCliente': new FormControl(""),
          'activo': new FormControl(true)
      });
      sender.addRow(this.formGroup);
    }

    protected editHandler({sender, rowIndex, dataItem}) {
      this.closeEditor(sender);

      this.idEdited = dataItem.idCliente;
      this.formGroup = new FormGroup({
          'idProyecto': new FormControl(dataItem.idProyecto, Validators.required),
          'codigoCliente': new FormControl(dataItem.codigoCliente),
          'nombreCliente': new FormControl(dataItem.nombreCliente),
          'activo': new FormControl(dataItem.activo, Validators.required)
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
      let uri  = environment.urlClientsFilter + "/" + this.idAdmin;
      let url = this.servicio.getUrl(uri);

      this.servicio.getList(url).subscribe(data => {
        this.clientes = data;
        this.gridData = process(this.clientes, this.state);
      }, e => {
        sessionStorage.removeItem('token');
        this.router.navigate(['/login']);
      });

    }

    protected saveHandler({sender, rowIndex, formGroup, isNew}) {
      const dataItem: MobileCliente = formGroup.value;
      
      if(isNew){
        this.servicio.add(dataItem).subscribe(data => {
          if(this.idRolAdmin==2) this.asignClientToAdmin(this.idAdmin, data.idCliente);
          this.clientes.push(data);
          this.gridData = process(this.clientes, this.state);
        }, e =>{
              sessionStorage.removeItem("token");
              this.router.navigate(["/login"]);
        });
      }else{
        dataItem.idCliente = this.idEdited;
        this.servicio.update(dataItem, dataItem.idCliente).subscribe(data => {
            this.getList();
        }, e =>{
            sessionStorage.removeItem("token");
            this.router.navigate(["/login"]);
        });
      }

      sender.closeRow(rowIndex);
    }

    private asignClientToAdmin(idAdmin: number, idClient: number){
      this.servicio.urlRequest = environment.urlUsersAsigned;
      let dataItem = new MobileAdminClientes(0, idAdmin, idClient);
      
      this.servicio.add(dataItem).subscribe(data => {
          console.log("Cliente asignado con éxito");
          //reset clients url value
          this.servicio.urlRequest = environment.urlClients;
      }, e =>{
            sessionStorage.removeItem("token");
            this.router.navigate(["/login"]);
      });

    }

    protected removeHandler({dataItem}) {
      this.dataRemove = dataItem;
      this.confirmModal.modal.open();
    }

    public remove(){
      if(this.dataRemove){
        this.servicio.delete(this.dataRemove.idCliente).subscribe(data => {
            this.getList();
            this.confirmModal.modal.close();
        }, e =>{
            sessionStorage.removeItem("token");
            this.router.navigate(["/login"]);
        });
      }
    }


    public getListProyectos(): void{
      this.servicio.getList().subscribe(data => {
        this.proyectos = data;
      }, e => {
        sessionStorage.removeItem('token');
        this.router.navigate(['/login']);
      });

    }

    public buscarProyecto(id: number): any{
      if(this.proyectos!=null){
        if(this.proyectos.length>0){
          return this.proyectos.find(x => x.idProyecto === id);
        }else{
          return new MobileProyecto(0, "");
        }
      }
    }
    
    public filtroProyecto(idProyecto: Number){
        if(idProyecto){
          this.gridData = process(this.clientes.filter(item => item.idProyecto == idProyecto), this.state);
        }else{
          this.gridData = process(this.clientes, this.state);
        }
    }

    /***************************************************************************/


    /***************************************************************************/
    //subida masiva
    public showModalFile(){
      this.modalFile.modal.open();
    }

    /*
    public changeFileInput($event) : void {
      this.initInputFile($event.target);
    }
  
    public initInputFile(inputValue: any) : void {
      let file:File = inputValue.files[0]; 
      let reader:FileReader = new FileReader();
      let that = this;
  
      reader.onloadend = function(e){       
        let lines = reader.result.split("\n");
        that.ProcessFileClient(lines);
      }
  
      reader.readAsText(file);
    }
    */

    private ProcessFileClient(text: Array<string>){
      let clients = new Array<MobileCliente>();

      for(let x = 1; x < text.length; x++){
        let campos = text[x].split(";");
        let idProyecto = Number(campos[0]);
        let codigoCliente = campos[1];
        let nombreCliente = campos[2].trim();

        let client = new MobileCliente(0, idProyecto, codigoCliente, nombreCliente, true);
        clients.push(client);
      }

      this.SendClientsList(clients);

    }

    private SendClientsList(clients: Array<MobileCliente>){
      let uri  = environment.urlClients + "/sincronizacion";
      let url = this.servicio.getUrl(uri);

      this.servicio.add(clients, url).subscribe(data => {
          console.log("sendClientList: " + JSON.stringify(data));
          if(this.idRolAdmin==2) this.asignClientListToAdmin(this.idAdmin, data);
          this.getList();
          this.modalFile.modal.close();
      }, e =>{
          sessionStorage.removeItem("token");
          this.router.navigate(["/login"]);
      });
    }


    private asignClientListToAdmin(idAdmin: number, clients: Array<MobileResultadoSincronizacion>){
      this.servicio.urlRequest = environment.urlUsersAsigned + "/sincronizacion";

      let asignedClients = new Array<MobileAdminClientes>();
      for(let client of clients)
      {
        console.log("asignar cliente. admin: " + this.idAdmin + " - cliente " + client.id);
        let item = new MobileAdminClientes(0, idAdmin, client.id);
        asignedClients.push(item);
      }
      
      this.servicio.add(asignedClients).subscribe(data => {
          console.log("Cliente asignado con éxito");
          //reset clients url value
          this.servicio.urlRequest = environment.urlClients;
      }, e =>{
            sessionStorage.removeItem("token");
            this.router.navigate(["/login"]);
      });

    }
    /***************************************************************************/

}
