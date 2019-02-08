import { Component, OnInit, ViewChild } from '@angular/core';
import { DatosService } from 'src/app/services/datos.service';
import { FuncionesService } from 'src/app/services/funciones.service';

declare var google;

@Component({
  selector: 'app-ventas003',
  templateUrl: './ventas003.page.html',
  styleUrls: ['./ventas003.page.scss'],
})
export class Ventas003Page implements OnInit {

  usuario = '';

  constructor(  private datos: DatosService,
                private funciones: FuncionesService ) {
    this.datos.readDatoLocal( 'KRpt_Susa_usuario' ).
      then( dato => { this.usuario = dato; console.log( dato ); } );
   }

  ngOnInit() {
    console.log('ngOnInit Ventas003', this.usuario );
    this.datos.getReport( { reporte: 3,
                            empresa: '01',
                            sucursal: '001' } )
        .subscribe( data => { this.cargaDatos( data ); },
                    err  => { this.funciones.descargaEspera(); this.funciones.msgAlert( 'ATENCION', err ); }
                  );
  }

  cargaDatos( data ) {
    const total = [0, 0, 0, 0, 0];
    const rs = data.datos;
    console.log( 'rs->', rs );
    if ( rs === undefined || rs.length === 0 ) {
      this.funciones.muestraySale('ATENCION : Vendedores  no presentan datos para representar', 2 );
    } else {
      // datos para xAxis
      const eje       = [ [ 'Semanas', 'Ventas'],
                          [ '', 0.0 ],
                          [ '', 0.0 ],
                          [ '', 0.0 ],
                          [ '', 0.0 ]];
      const eje_table = [];
      //
      rs.forEach( element => {
        //
        eje[1][0] = element.peri0.substring(0, 5) ; eje[1][1] += element.ventas0 ;
        eje[2][0] = element.peri1.substring(0, 5) ; eje[2][1] += element.ventas1 ;
        eje[3][0] = element.peri2.substring(0, 5) ; eje[3][1] += element.ventas2 ;
        eje[4][0] = element.peri3.substring(0, 5) ; eje[4][1] += element.ventas3 ;
        //
        eje_table.push( [ element.vendedor,
                          { v: (element.promedio / 1000000), f: (element.promedio / 1000000).toFixed(1).toString() },
                          { v: (element.ventas0 / 1000000 ), f: (element.ventas0 / 1000000 ).toFixed(1).toString()  },
                          { v: (element.ventas1 / 1000000 ), f: (element.ventas1 / 1000000 ).toFixed(1).toString()  },
                          { v: (element.ventas2 / 1000000 ), f: (element.ventas2 / 1000000 ).toFixed(1).toString()  },
                          { v: (element.ventas3 / 1000000 ), f: (element.ventas3 / 1000000 ).toFixed(1).toString()  },
                          element.nombreven.substring(0, 12 ) ] );
        total[0] += element.ventas0 ;
        total[1] += element.ventas1 ;
        total[2] += element.ventas2 ;
        total[3] += element.ventas3 ;
      });
      //
      total[4] = (( total[0] + total[1] + total[2] + total[3] ) / 4 ) / 1000000 ;
      eje_table.push( [ '>>>',
                        {v: total[4], f: (total[4] / 1000000).toFixed(1).toString() },
                        {v: total[0], f: (total[0] / 1000000).toFixed(1).toString() },
                        {v: total[1], f: (total[1] / 1000000).toFixed(1).toString() },
                        {v: total[2], f: (total[2] / 1000000).toFixed(1).toString() },
                        {v: total[3], f: (total[3] / 1000000).toFixed(1).toString() },
                        'Totales' ] );

      // grafica de barras
      const datos = google.visualization.arrayToDataTable( eje );
      const opciones = {
        title:      'Ventas últimas 4 semanas',
        chartArea:  { width: '70%'},
        hAxis:      { title: 'Total de Ventas', minValue: 0 },
        vAxis:      { title: 'Semanas' }
      };
      const bar_Chart = new google.visualization.BarChart(document.getElementById('bar_chart_div'));
      bar_Chart.draw( datos, opciones );

      // tabla de datos
      const data_table = new google.visualization.DataTable();
      data_table.addColumn('string', 'Vend');
      data_table.addColumn('number', 'Prom');
      data_table.addColumn('number', eje[1][0] ) ;
      data_table.addColumn('number', eje[2][0] );
      data_table.addColumn('number', eje[3][0] );
      data_table.addColumn('number', eje[4][0] );
      data_table.addColumn('string', 'Nombre Vendedor');
      data_table.addRows( eje_table );
      const table = new google.visualization.Table(document.getElementById('table_div'));

      // colocar un flecha
      // const formatter = new google.visualization.ArrowFormat();
      // formatter.format(data_table, 7 ); // Apply formatter to second column

      table.draw(data_table, {showRowNumber: false, width: '100%', height: '100%'});

    }
  }

}
