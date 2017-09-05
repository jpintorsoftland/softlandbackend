"use strict";
var MobileUsuario = (function () {
    function MobileUsuario(idUsuario, idCliente, codigoUsuario, codigoCliente, nombreUsuario, email, password, activo) {
        this.idUsuario = idUsuario;
        this.idCliente = idCliente;
        this.codigoUsuario = codigoUsuario;
        this.codigoCliente = codigoCliente;
        this.nombreUsuario = nombreUsuario;
        this.email = email;
        this.password = password;
        this.activo = activo;
    }
    return MobileUsuario;
}());
exports.MobileUsuario = MobileUsuario;
//# sourceMappingURL=MobileUsuario.js.map