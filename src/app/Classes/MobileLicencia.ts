export class MobileLicencia{

    constructor(public idLicencia: number,
                public idCliente: number,
                public idEmpresa: number,
                public idInstancia: number,
                public idModulo: number,
                public idTipoPermiso: number,
                public codigoLicencia: string,
                public codigoInstancia: string,
                public codigoCliente: string,
                public codigoEmpresa: string,
                public fechaInicio: string,
                public fechaFin: string,
                public caduca: string,
                public workspaceID: string,
                public accesKey: string,
                public sesionesDisponibles: string,
                public sesionesEnUso: string,
                public activo: boolean){

    }
}