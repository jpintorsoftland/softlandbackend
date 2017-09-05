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
var http_1 = require("@angular/http");
var Observable_1 = require("rxjs/Observable");
require("../../rxjs/index");
var MobileModuloService = (function () {
    function MobileModuloService(http) {
        this.http = http;
        this.apiUrl = "http://softlandcloudbackendcert.azurewebsites.net/api/";
    }
    MobileModuloService.prototype.getModulos = function () {
        return this.http.get(this.getUrl('modulos'), this.getOptions()).map(this.getDatos).catch(this.error);
    };
    MobileModuloService.prototype.addModulo = function (model) {
        return this.http.post(this.getUrl('modulos'), model, this.getOptions()).map(this.getDatos).catch(this.error);
    };
    MobileModuloService.prototype.deleteModulo = function (model) {
        return this.http.delete(this.getUrl('modulos') + '/' + model.idModulo, this.getOptions()).catch(this.error);
    };
    MobileModuloService.prototype.updateModulo = function (model) {
        return this.http.put(this.getUrl('modulos') + '/' + model.idModulo, model, this.getOptions()).catch(this.error);
    };
    MobileModuloService.prototype.error = function (error) {
        var msg = (error.message) ? error.message : "Ha ocurrido un error";
        console.log(msg);
        return Observable_1.Observable.throw(msg);
    };
    MobileModuloService.prototype.getDatos = function (data) {
        var datos = data.json();
        return datos || [];
    };
    MobileModuloService.prototype.getUrl = function (model) {
        return this.apiUrl + model;
    };
    MobileModuloService.prototype.getOptions = function () {
        var auth = new http_1.Headers({ 'Authorization': 'Bearer ' + sessionStorage.getItem('token') });
        var options = new http_1.RequestOptions({ headers: auth });
        return options;
    };
    return MobileModuloService;
}());
MobileModuloService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], MobileModuloService);
exports.MobileModuloService = MobileModuloService;
//# sourceMappingURL=MobileModuloService.js.map