import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MobileModulo } from '../../Classes/MobileModulo';
import { MobileModuloService } from '../../Services/MobileModuloApi/MobileModuloService';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

@Component({
  moduleId: module.id,
  selector: 'my-app',
  templateUrl: 'app.component.html',
})
export class AppComponent implements OnInit { 
  modulos: Array<MobileModulo> = [];
  modulo: MobileModulo = new MobileModulo(0, '', true);
  @ViewChild('modal')
  modal: ModalComponent;

  constructor(private servicio:MobileModuloService, private router: Router){}

  ngOnInit(){
    this.servicio.getModulos().subscribe(data => {
      this.modulos = data;
    }, e => {
      sessionStorage.removeItem('token');
      this.router.navigate(['/login']);
    });
    
  }

  guardar(model:MobileModulo){
    console.log("guardar");
    if(model.idModulo === 0){
      this.servicio.addModulo(model).subscribe(data => {
        this.modulos.push(data);
      }, e =>{
            sessionStorage.removeItem("token");
            this.router.navigate(["/login"]);
      });
    }else{
      this.servicio.updateModulo(model).subscribe(data => {} , e => {
        sessionStorage.removeItem("token");
        this.router.navigate(["/login"]);
      });
    }

    this.modal.dismiss();
  }

  addModulo(){
    this.modulo = new MobileModulo(0, '', true);
    this.modal.open();
    
  }

  onBorrar(model:MobileModulo){
    this.modulos.splice(this.modulos.indexOf(model), 1);
  }

  onModificar(model:MobileModulo){
    this.modulo = model;
    this.modal.open();
  }

}
