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
                public fechaInicio: Date,
                public fechaFin: Date,
                public caduca: boolean,
                public activo: boolean){

    }
}