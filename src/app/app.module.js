"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/http");
var app_component_1 = require("./Components/main/app.component");
var default_component_1 = require("./Components/default-module/default.component");
var ng2_bs3_modal_1 = require("ng2-bs3-modal/ng2-bs3-modal");
var login_component_1 = require("./Components/login-module/login.component");
var form_module_component_1 = require("./Components/form-module/form-module.component");
var list_module_component_1 = require("./Components/list-module/list-module.component");
var MobileModuloService_1 = require("./Services/MobileModuloApi/MobileModuloService");
var AuthService_1 = require("./Services/AuthService/AuthService");
var app_routing_1 = require("./Routes/app-routing");
var auth_guard_1 = require("./Guards/auth-guard");
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        imports: [platform_browser_1.BrowserModule, forms_1.FormsModule, http_1.HttpModule, app_routing_1.routing, ng2_bs3_modal_1.Ng2Bs3ModalModule],
        declarations: [app_component_1.AppComponent, default_component_1.DefaultComponent, login_component_1.LoginComponent, form_module_component_1.FormularioModuloComponent, list_module_component_1.ListadoModuloComponent],
        bootstrap: [default_component_1.DefaultComponent],
        providers: [MobileModuloService_1.MobileModuloService, AuthService_1.AuthService, auth_guard_1.AuthGuard]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map