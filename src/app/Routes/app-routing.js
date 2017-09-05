"use strict";
var router_1 = require("@angular/router");
var login_component_1 = require("../Components/login-module/login.component");
var app_component_1 = require("../Components/main/app.component");
var auth_guard_1 = require("../Guards/auth-guard");
var appRoutes = [
    { path: "login", component: login_component_1.LoginComponent },
    { path: "", component: app_component_1.AppComponent, canActivate: [auth_guard_1.AuthGuard] },
    { path: "**", redirectTo: "" }
];
exports.routing = router_1.RouterModule.forRoot(appRoutes);
//# sourceMappingURL=app-routing.js.map