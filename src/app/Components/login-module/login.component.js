"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var AuthService_1 = require("../../Services/AuthService/AuthService");
var MobileUsuario_1 = require("../../Classes/MobileUsuario");
var LoginComponent = (function () {
    function LoginComponent(router, authentificationService) {
        this.router = router;
        this.authentificationService = authentificationService;
        this.model = new MobileUsuario_1.MobileUsuario(0, 0, '', '', '', '', '', false);
        this.error = '';
        this.loading = false;
    }
    LoginComponent.prototype.ngOnInit = function () {
        this.authentificationService.logout();
    };
    LoginComponent.prototype.login = function () {
        var _this = this;
        this.loading = true;
        this.authentificationService.login(this.model)
            .subscribe(function (result) {
            console.log("result: " + result);
            if (result === true) {
                _this.router.navigate(['/']);
            }
            else {
                _this.error = "Datos de acceso incorrectos";
                _this.loading = false;
            }
        }, function (e) {
            _this.error = 'Datos de acceso incorrectos';
            _this.loading = false;
        });
    };
    return LoginComponent;
}());
LoginComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: 'login.html',
        selector: 'login'
    }),
    __metadata("design:paramtypes", [router_1.Router,
        AuthService_1.AuthService])
], LoginComponent);
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.component.js.map