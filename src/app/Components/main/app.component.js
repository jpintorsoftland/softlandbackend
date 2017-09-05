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
var MobileModulo_1 = require("../../Classes/MobileModulo");
var MobileModuloService_1 = require("../../Services/MobileModuloApi/MobileModuloService");
var ng2_bs3_modal_1 = require("ng2-bs3-modal/ng2-bs3-modal");
var AppComponent = (function () {
    function AppComponent(servicio, router) {
        this.servicio = servicio;
        this.router = router;
        this.modulos = [];
        this.modulo = new MobileModulo_1.MobileModulo(0, '', true);
    }
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.servicio.getModulos().subscribe(function (data) {
            _this.modulos = data;
        }, function (e) {
            sessionStorage.removeItem('token');
            _this.router.navigate(['/login']);
        });
    };
    AppComponent.prototype.guardar = function (model) {
        var _this = this;
        console.log("guardar");
        if (model.idModulo === 0) {
            this.servicio.addModulo(model).subscribe(function (data) {
                _this.modulos.push(data);
            }, function (e) {
                sessionStorage.removeItem("token");
                _this.router.navigate(["/login"]);
            });
        }
        else {
            this.servicio.updateModulo(model).subscribe(function (data) { }, function (e) {
                sessionStorage.removeItem("token");
                _this.router.navigate(["/login"]);
            });
        }
        this.modal.dismiss();
    };
    AppComponent.prototype.addModulo = function () {
        this.modulo = new MobileModulo_1.MobileModulo(0, '', true);
        this.modal.open();
    };
    AppComponent.prototype.onBorrar = function (model) {
        this.modulos.splice(this.modulos.indexOf(model), 1);
    };
    AppComponent.prototype.onModificar = function (model) {
        this.modulo = model;
        this.modal.open();
    };
    return AppComponent;
}());
__decorate([
    core_1.ViewChild('modal'),
    __metadata("design:type", ng2_bs3_modal_1.ModalComponent)
], AppComponent.prototype, "modal", void 0);
AppComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'my-app',
        templateUrl: 'app.component.html',
    }),
    __metadata("design:paramtypes", [MobileModuloService_1.MobileModuloService, router_1.Router])
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map