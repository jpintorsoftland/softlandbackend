import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

//componnents
import { LoginComponent } from './Components/login/login.component';
import { DefaultComponent } from './Components/default/default.component';
import { AdminComponent } from './Components/admin/admin.component';
import { AppComponent } from './Components/main/app.component';
import { ApplicationComponent } from './Components/application/application.component';
import { ClientComponent } from './Components/client/client.component';
import { ModuleComponent } from './Components/module/module.component';
import { UserComponent } from './Components/user/user.component';
import { ProjectComponent } from './Components/project/project.component';
import { LicenseComponent } from './Components/license/license.component';
import { InstanceComponent } from './Components/instance/instance.component';
import { CompanyComponent } from './Components/company/company.component';

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
      AppComponent, 
      ApplicationComponent,
      ClientComponent,
      ModuleComponent,
      UserComponent,
      LicenseComponent,
      ProjectComponent,
      InstanceComponent,
      CompanyComponent
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
      DropDownsModule
    ],
  providers: [ 
      CRUDService,
      AuthService, 
      AuthGuard,
      SuperAdminGuard,
      ConsultantGuard 
    ],
  bootstrap: 
    [ 
      DefaultComponent 
    ]
})

export class AppModule { }
