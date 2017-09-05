import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MobileModulo } from '../../Classes/MobileModulo';
import { Router } from '@angular/router';
import { MobileModuloService } from '../../Services/MobileModuloApi/MobileModuloService';

@Component({
    moduleId: module.id,
    selector: 'list-module',
    templateUrl: 'list-module.html'
})

export class ListadoModuloComponent{
    @Input() modulos: Array<MobileModulo>;
    @Output() borrado: EventEmitter<MobileModulo> = new EventEmitter<MobileModulo>();
    @Output() modificado: EventEmitter<MobileModulo> = new EventEmitter<MobileModulo>();

    constructor(private servicio: MobileModuloService, private router: Router){

    }

    displayModulo(modulo: MobileModulo){
        console.log(modulo);
    }

    deleteModulo(model:MobileModulo){
        console.log("deleteModulo" + model.descripcion );
        this.servicio.deleteModulo(model).subscribe(o => {
            this.borrado.emit(model);
        }, e=>{
            sessionStorage.removeItem('token');
            this.router.navigate(['/login']);
        });
    }

    updateModulo(model: MobileModulo){
        console.log("updateModulo" + model.descripcion );
        this.modificado.emit(model);
    }

 }