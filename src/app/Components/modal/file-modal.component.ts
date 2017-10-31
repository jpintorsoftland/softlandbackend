import { Component, Output, Input, ViewChild, EventEmitter  } from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

@Component({
    selector: 'file-modal',
    templateUrl: 'file-modal.component.html'
})

export class ModalFileComponent {
    @Input() title: string;
    @Input() message: string;

    @Output() processFile: EventEmitter<Array<string>> = new EventEmitter();
    

    @ViewChild('modal')
    public modal: ModalComponent;

    public changeFileInput($event) : void {
        this.initInputFile($event.target);
    }

    public initInputFile(inputValue: any) : void {
        let file:File = inputValue.files[0]; 
        let reader:FileReader = new FileReader();
        let that = this;

        reader.onloadend = function(e){       
            let lines = reader.result.split("\n");
            that.processFile.emit(lines);
        }

        reader.readAsText(file);
    }
}