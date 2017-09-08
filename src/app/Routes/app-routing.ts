import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from '../Components/login/login.component';
import { AppComponent } from "../Components/main/app.component";
import { ApplicationComponent } from "../Components/application/application.component";
import { ClientComponent } from "../Components/client/client.component";
import { ModuleComponent } from "../Components/module/module.component";
import { UserComponent } from "../Components/user/user.component";
import { AuthGuard } from "../Guards/auth-guard";

const appRoutes: Routes = [
    { path: "login", component: LoginComponent },
    { path: "", component: AppComponent, canActivate: [AuthGuard] },
    { path: "aplicaciones", component: ApplicationComponent, canActivate: [AuthGuard] },
    { path: "clientes", component: ClientComponent, canActivate: [AuthGuard] },
    { path: "modulos", component: ModuleComponent, canActivate: [AuthGuard] },
    { path: "usuarios", component: UserComponent, canActivate: [AuthGuard] },
    { path: "**", redirectTo: ""}
];

export const Routing = RouterModule.forRoot(appRoutes);