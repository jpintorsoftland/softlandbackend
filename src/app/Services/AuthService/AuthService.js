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
var AuthService = (function () {
    function AuthService(http) {
        this.http = http;
        this.apiUrl = "http://softlandcloudbackendcert.azurewebsites.net/api/";
    }
    AuthService.prototype.login = function (usuario) {
        var body = 'Email=' + usuario.email + '&Password=' + usuario.password;
        console.log("body: " + body);
        var headers = new http_1.Headers({ 'Content-type': 'application/x-www-form-urlencoded' });
        var options = new http_1.RequestOptions({ 'headers': headers });
        return this.http.post(this.getUrl('jwt'), body, options).map(this.getDatos).catch(this.error);
    };
    AuthService.prototype.logout = function () {
        sessionStorage.removeItem('token');
    };
    AuthService.prototype.error = function (error) {
        var msg = (error.message) ? error.message : "Ha ocurrido un error";
        return Observable_1.Observable.throw(msg);
    };
    AuthService.prototype.getDatos = function (data) {
        var datos = data.json();
        if (datos && datos.access_token) {
            sessionStorage.setItem('token', datos.access_token);
            return true;
        }
        return false;
    };
    AuthService.prototype.getUrl = function (model) {
        return this.apiUrl + model;
    };
    return AuthService;
}());
AuthService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=AuthService.js.map