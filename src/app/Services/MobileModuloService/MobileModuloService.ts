import { Injectable } from '@angular/core'; 
import { MobileModulo } from '../../Classes/MobileModulo';

const MODULOS : Array<MobileModulo> = [
    new MobileModulo(1, 'Aprobaciones', true),
    new MobileModulo(2, 'BI', true),
    new MobileModulo(3, 'Facturación', true)
];

const RETRASO = 500;

@Injectable()
export class MobileModuloService{

    getModulos(){
        return new Promise<MobileModulo[]> (
            data =>
            {
                setTimeout( () => { return data(MODULOS) }, RETRASO);
            }
        )
    }
}