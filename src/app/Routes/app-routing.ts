import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from '../Components/login-module/login.component';
import { AppComponent } from "../Components/main/app.component";
import { AuthGuard } from "../Guards/auth-guard";

const appRoutes: Routes = [
    { path: "login", component: LoginComponent },
    { path: "", component: AppComponent, canActivate: [AuthGuard] },
    { path: "**", redirectTo: ""}
];

export const routing = RouterModule.forRoot(appRoutes);