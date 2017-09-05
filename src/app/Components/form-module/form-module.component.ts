import {Component, Input, Output, EventEmitter} from '@angular/core';
import {MobileModulo} from '../../Classes/MobileModulo';

@Component({
    moduleId: module.id,
    selector: 'form-module',
    templateUrl: 'form-module.html'
})

export class FormularioModuloComponent{
    //model: MobileModulo = new MobileModulo(0, '', true);
    @Input() model : MobileModulo;
    @Output() onsubmit = new EventEmitter<any>();

    public submit(){
        this.onsubmit.emit(this.model);
        //console.log(this.model);
        //this.model = new MobileModulo(0, '', true);
    }
}