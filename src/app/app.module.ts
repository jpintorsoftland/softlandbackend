import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent }  from './Components/main/app.component';

import { DefaultComponent } from './Components/default-module/default.component';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';

import { LoginComponent } from './Components/login-module/login.component';
import { FormularioModuloComponent } from './Components/form-module/form-module.component';
import { ListadoModuloComponent } from './Components/list-module/list-module.component';
import { MobileModuloService } from './Services/MobileModuloApi/MobileModuloService';

import { AuthService } from './Services/AuthService/AuthService';
import { routing } from './Routes/app-routing';
import { AuthGuard } from './Guards/auth-guard';

@NgModule({
  imports:      [ BrowserModule, FormsModule, HttpModule, routing, Ng2Bs3ModalModule],
  declarations: [ AppComponent, DefaultComponent, LoginComponent, FormularioModuloComponent, ListadoModuloComponent ],
  bootstrap:    [ DefaultComponent ],
  providers:    [ MobileModuloService , AuthService, AuthGuard]
})
export class AppModule { }
