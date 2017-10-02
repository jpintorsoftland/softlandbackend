export class MobileResultadoSincronizacion{
    
        constructor(public id: number,
                    public codigoEntidad: string,
                    public nombreEntidad: string,
                    public fechaEntidad: Date,
                    public sincronizado: boolean,
                    public estadoServidor: number,
                    public mensaje: string){
    
        }
    }