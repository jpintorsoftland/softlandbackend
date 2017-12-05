import { Component, Output, Input, ViewChild, EventEmitter  } from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

@Component({
    selector: 'ok-modal',
    templateUrl: 'ok-modal.component.html'
})

export class ModalOkComponent {
    
    @ViewChild('modal')
    public modal: ModalComponent;

}
