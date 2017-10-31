import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from '../Components/login/login.component';
import { AppComponent } from "../Components/main/app.component";
import { AdminComponent } from "../Components/admin/admin.component";
import { AsignarClientesComponent } from "../Components/admin/asignar-clientes.component";
import { ApplicationComponent } from "../Components/application/application.component";
import { ClientComponent } from "../Components/client/client.component";
import { ModuleComponent } from "../Components/module/module.component";
import { UserComponent } from "../Components/user/user.component";
import { ProjectComponent } from "../Components/project/project.component";
import { LicenseComponent } from "../Components/license/license.component";
import { FormLicenseComponent } from "../Components/license/form-license.component";
import { InstanceComponent } from '../Components/instance/instance.component';
import { CompanyComponent } from '../Components/company/company.component';

import { AuthGuard } from "../Guards/auth-guard";
import { SuperAdminGuard } from "../Guards/superadmin-guard";
import { ConsultantGuard } from "../Guards/consultant-guard";

const appRoutes: Routes = [
    { path: "login", component: LoginComponent },
    { path: "", component: AppComponent, canActivate: [AuthGuard] },
    { path: "administradores", component: AdminComponent, canActivate: [AuthGuard, SuperAdminGuard] },
    { path: "administradores/clientes", component: AsignarClientesComponent, canActivate: [AuthGuard, SuperAdminGuard] },
    { path: "aplicaciones", component: ApplicationComponent, canActivate: [AuthGuard, SuperAdminGuard] },
    { path: "clientes", component: ClientComponent, canActivate: [AuthGuard, ConsultantGuard] },
    { path: "instancias", component: InstanceComponent, canActivate: [AuthGuard] },
    { path: "empresas", component: CompanyComponent, canActivate: [AuthGuard] },
    { path: "modulos", component: ModuleComponent, canActivate: [AuthGuard, SuperAdminGuard] },
    { path: "usuarios", component: UserComponent, canActivate: [AuthGuard] },
    { path: "proyectos", component: ProjectComponent, canActivate: [AuthGuard] },
    { path: "licencias", component: LicenseComponent, canActivate: [AuthGuard] },
    { path: "licencias/form", component: FormLicenseComponent, canActivate: [AuthGuard, ConsultantGuard] },
    { path: "**", redirectTo: ""}
];

export const Routing = RouterModule.forRoot(appRoutes);