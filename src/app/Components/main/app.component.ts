import { Component } from '@angular/core';

@Component({
  selector: 'app',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'Inicio';

  onButtonClick() {
    this.title = 'Cambiar titulo';
  }

}