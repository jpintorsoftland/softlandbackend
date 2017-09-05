export class MobileUsuario{
    constructor(public idUsuario: number,
                public idCliente: number,
                public codigoUsuario: string,
                public codigoCliente: string,
                public nombreUsuario: string,
                public email: string,
                public password: string,
                public activo: boolean){

    }
}