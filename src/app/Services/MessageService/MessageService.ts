import { MessageService } from '@progress/kendo-angular-l10n';

const messages = {
  'kendo.grid.noRecords': 'No hay datos disponibles.',
  'kendo.grid.pagerPage': 'Página',
  'kendo.grid.pagerOf': 'de',
  'kendo.grid.pagerItems': 'ítems',
  'kendo.grid.pagerItemsPerPage': 'ítems por página',
  'kendo.grid.filterEqOperator': 'Es igual a',
  'kendo.grid.filterNotEqOperator': 'Es distinto a',
  'kendo.grid.filterIsNullOperator': 'Es nulo',
  'kendo.grid.filterIsNotNullOperator': 'No es nulo',
  'kendo.grid.filterIsEmptyOperator': 'Está vacío',
  'kendo.grid.filterIsNotEmptyOperator': 'No está vacío',
  'kendo.grid.filterStartsWithOperator': 'Comienza con',
  'kendo.grid.filterContainsOperator': 'Contiene',
  'kendo.grid.filterNotContainsOperator': 'No contiene',
  'kendo.grid.filterEndsWithOperator': 'Termina con',
  'kendo.grid.filterGteOperator': 'Mayor o igual que',
  'kendo.grid.filterGtOperator': 'Mayor que',
  'kendo.grid.filterLteOperator': 'Menor o igual que',
  'kendo.grid.filterLtOperator': 'Menor que',
  'kendo.grid.filterIsTrue': 'Es verdadero',
  'kendo.grid.filterIsFalse': 'Es falso',
  'kendo.grid.filterBooleanAll': '(Todo)',
  'kendo.grid.filterAfterOrEqualOperator': 'Está después o en el mismo sitio que',
  'kendo.grid.filterAfterOperator': 'Está después',
  'kendo.grid.filterBeforeOperator': 'Está antes',
  'kendo.grid.filterBeforeOrEqualOperator': 'Está después o en el mismo sitio',
  'kendo.calendar.today': 'Hoy',
  'kendo.dateinput.increment': 'Aumentar valor',
  'kendo.dateinput.decrement': 'Disminuar valor',
  'kendo.datepicker.today': 'Hoy',
  'kendo.datepicker.toggle': 'Cambiar calendario',
  'kendo.timepicker.accept': 'Aceptar',
  'kendo.timepicker.acceptLabel': 'Aceptar',
  'kendo.timepicker.cancel': 'Cancelar',
  'kendo.timepicker.cancelLabel': 'Cancelar',
  'kendo.timepicker.now': 'Ahora',
  'kendo.timepicker.nowLabel': 'Ahora',
  'kendo.timepicker.toggle': 'Cambiar lista'
};

export class MyMessageService extends MessageService {
  public get(key: string): string {
    return messages[key];
  }
}