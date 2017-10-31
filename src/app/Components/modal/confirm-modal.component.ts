import { Component, Output, Input, ViewChild, EventEmitter  } from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

@Component({
    selector: 'confirm-modal',
    templateUrl: 'confirm-modal.component.html'
})

export class ModalConfirmComponent {
    @Input() title: string;
    @Input() message: string;

    @Output() acceptChanged: EventEmitter<number> = new EventEmitter();
    

    @ViewChild('modal')
    public modal: ModalComponent;

    public aceptar(){
      this.acceptChanged.emit();
    }
}
