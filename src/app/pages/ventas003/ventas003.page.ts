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
    let t1 = 0; let t2 = 0; let t3 = 0; let t4 = 0;
    const rs = data.datos;
    //
    let tit0 = '';
    let tit1 = '';
    let tit2 = '';
    let tit3 = '';
    //
    console.log( 'rs->', rs );
    if ( rs === undefined || rs.length === 0 ) {
      this.funciones.muestraySale('ATENCION : Vendedores  no presentan datos para representar', 2 );
    } else {
      // datos para xAxis
      const eje = [ [ 'Semanas', 'Ventas'],
                    [ '', 0.0 ],
                    [ '', 0.0 ],
                    [ '', 0.0 ],
                    [ '', 0.0 ]];
      const eje_table = [];
      //
      rs.forEach( element => {
        // Y-titulos de grafico
        tit0 = element.peri0.substring(0, 5) ;
        tit1 = element.peri1.substring(0, 5) ;
        tit2 = element.peri2.substring(0, 5) ;
        tit3 = element.peri3.substring(0, 5) ;
        // matriz para barras
        eje[1][0] = element.peri0 ; t1 += element.ventas0 / 1000000 ; eje[1][1] = t1;
        eje[2][0] = element.peri1 ; t2 += element.ventas1 / 1000000 ; eje[2][1] = t2;
        eje[3][0] = element.peri2 ; t3 += element.ventas2 / 1000000 ; eje[3][1] = t3;
        eje[4][0] = element.peri3 ; t4 += element.ventas3 / 1000000 ; eje[4][1] = t4;
        // matriz para listado
        eje_table.push( [ element.vendedor,
                          { v: element.promedio, f: (element.promedio / 1000000).toFixed(1).toString() },
                          { v: element.ventas0 , f: (element.ventas0 / 1000000 ).toFixed(1).toString() },
                          { v: element.ventas1 , f: (element.ventas1 / 1000000 ).toFixed(1).toString() },
                          { v: element.ventas2 , f: (element.ventas2 / 1000000 ).toFixed(1).toString() },
                          { v: element.ventas3 , f: (element.ventas3 / 1000000 ).toFixed(1).toString() },
                          element.nombreven.substring(0, 12 ) ] );
        total[0] += element.ventas0 ;
        total[1] += element.ventas1 ;
        total[2] += element.ventas2 ;
        total[3] += element.ventas3 ;
      });
      //
      total[4] = ( total[0] + total[1] + total[2] + total[3] ) / 4 ;
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
        chartArea:  { width: '50%'},
        hAxis:      { title: 'Total de Ventas', minValue: 0 },
        vAxis:      { title: 'Semanas' }
      };
      const bar_Chart = new google.visualization.BarChart(document.getElementById('bar_chart_div'));
      bar_Chart.draw( datos, opciones );

      // tabla de datos
      const data_table = new google.visualization.DataTable();
      data_table.addColumn('string', 'Vend');
      data_table.addColumn('number', 'Prom');
      data_table.addColumn('number', tit0 ) ;
      data_table.addColumn('number', tit1 );
      data_table.addColumn('number', tit2 );
      data_table.addColumn('number', tit3 );
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
