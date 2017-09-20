import { Component, OnInit, Input, Output, ViewChild, EventEmitter, Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

@Component({
    selector: 'confirm-modal',
    templateUrl: 'confirm-modal.html'
})

export class ModalConfirmComponent implements OnInit{
    @Output() showModal = new EventEmitter();
    @ViewChild('modal')
    modal: ModalComponent;

    //grid
    public formGroup: FormGroup;
    private editedRowIndex: number;
    public idEdited: number;
    public dataRemove: any;


    constructor(){
    }

    public ngOnInit(): void{
        //
    }
  

    public show(){
        this.modal.open();
    }

    public remove() {
      //
    }
    /***************************************************************************/

}
