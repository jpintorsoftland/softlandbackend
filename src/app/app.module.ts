import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

//componnents
import { LoginComponent } from './Components/login/login.component';
import { DefaultComponent } from './Components/default/default.component';
import { AppComponent } from './Components/main/app.component';
import { ApplicationComponent } from './Components/application/application.component';
import { ClientComponent } from './Components/client/client.component';
import { ModuleComponent } from './Components/module/module.component';
import { UserComponent } from './Components/user/user.component';

//services
import { CRUDService } from './Services/CRUDService/CRUDService';
import { AuthService } from './Services/AuthService/AuthService';
//routing
import { Routing } from './Routes/app-routing';
import { AuthGuard } from './Guards/auth-guard';

//import { crypto} from 'crypto-browserify';

@NgModule({
  declarations: [
      LoginComponent,
      DefaultComponent,
      AppComponent, 
      ApplicationComponent,
      ClientComponent,
      ModuleComponent,
      UserComponent
  ],
  imports: [
      BrowserModule,
      FormsModule,
      HttpModule,
      BrowserAnimationsModule,
      Routing,
      ButtonsModule,
      GridModule,
      DropDownsModule,
      //crypto
    ],
  providers: [ 
      CRUDService,
      AuthService, 
      AuthGuard 
    ],
  bootstrap: 
    [ 
      DefaultComponent 
    ]
})

export class AppModule { }
