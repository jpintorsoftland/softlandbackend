import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';

import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';

//componnents
import { LoginComponent } from './Components/login/login.component';
import { DefaultComponent } from './Components/default/default.component';
import { AdminComponent } from './Components/admin/admin.component';
import { AsignarClientesComponent } from "./Components/admin/asignar_clientes.component";
import { AppComponent } from './Components/main/app.component';
import { ApplicationComponent } from './Components/application/application.component';
import { ClientComponent } from './Components/client/client.component';
import { ModuleComponent } from './Components/module/module.component';
import { UserComponent } from './Components/user/user.component';
import { ProjectComponent } from './Components/project/project.component';
import { LicenseComponent } from './Components/license/license.component';
import { FormLicenseComponent } from './Components/license/form-license.component';
import { InstanceComponent } from './Components/instance/instance.component';
import { CompanyComponent } from './Components/company/company.component';
import { ModalConfirmComponent } from './Components/modal/confirm-modal';

//services
import { CRUDService } from './Services/CRUDService/CRUDService';
import { AuthService } from './Services/AuthService/AuthService';
//routing
import { Routing } from './Routes/app-routing';
import { AuthGuard } from './Guards/auth-guard';
import { SuperAdminGuard } from "./Guards/superadmin-guard";
import { ConsultantGuard } from "./Guards/consultant-guard";

@NgModule({
  declarations: [
      LoginComponent,
      DefaultComponent,
      AdminComponent,
      AsignarClientesComponent,
      AppComponent, 
      ApplicationComponent,
      ClientComponent,
      ModuleComponent,
      UserComponent,
      LicenseComponent,
      FormLicenseComponent,
      ProjectComponent,
      InstanceComponent,
      CompanyComponent,
      ModalConfirmComponent
  ],
  imports: [
      BrowserModule,
      HttpModule,
      BrowserAnimationsModule,
      FormsModule,
      ReactiveFormsModule,
      Routing,
      ButtonsModule,
      GridModule,
      DropDownsModule,
      DateInputsModule,
      InputsModule,
      Ng2Bs3ModalModule
    ],
  providers: [ 
      CRUDService,
      AuthService, 
      AuthGuard,
      SuperAdminGuard,
      ConsultantGuard,
      //{ provide: LOCALE_ID, useValue: 'es' } 
    ],
  bootstrap: 
    [ 
      DefaultComponent 
    ]
})

export class AppModule { }
