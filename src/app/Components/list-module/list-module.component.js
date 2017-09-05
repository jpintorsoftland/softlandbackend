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
var MobileModuloService_1 = require("../../Services/MobileModuloApi/MobileModuloService");
var ListadoModuloComponent = (function () {
    function ListadoModuloComponent(servicio, router) {
        this.servicio = servicio;
        this.router = router;
        this.borrado = new core_1.EventEmitter();
        this.modificado = new core_1.EventEmitter();
    }
    ListadoModuloComponent.prototype.displayModulo = function (modulo) {
        console.log(modulo);
    };
    ListadoModuloComponent.prototype.deleteModulo = function (model) {
        var _this = this;
        console.log("deleteModulo" + model.descripcion);
        this.servicio.deleteModulo(model).subscribe(function (o) {
            _this.borrado.emit(model);
        }, function (e) {
            sessionStorage.removeItem('token');
            _this.router.navigate(['/login']);
        });
    };
    ListadoModuloComponent.prototype.updateModulo = function (model) {
        console.log("updateModulo" + model.descripcion);
        this.modificado.emit(model);
    };
    return ListadoModuloComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Array)
], ListadoModuloComponent.prototype, "modulos", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], ListadoModuloComponent.prototype, "borrado", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], ListadoModuloComponent.prototype, "modificado", void 0);
ListadoModuloComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'list-module',
        templateUrl: 'list-module.html'
    }),
    __metadata("design:paramtypes", [MobileModuloService_1.MobileModuloService, router_1.Router])
], ListadoModuloComponent);
exports.ListadoModuloComponent = ListadoModuloComponent;
//# sourceMappingURL=list-module.component.js.map