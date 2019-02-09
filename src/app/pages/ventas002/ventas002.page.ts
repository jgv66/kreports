import { Component, OnInit, ViewChild } from '@angular/core';
import { DatosService } from 'src/app/services/datos.service';
import { FuncionesService } from 'src/app/services/funciones.service';

declare var google;

@Component({
  selector: 'app-ventas002',
  templateUrl: './ventas002.page.html',
  styleUrls: ['./ventas002.page.scss'],
})
export class Ventas002Page implements OnInit {

  usuario = '';

  constructor(  private datos: DatosService,
                private funciones: FuncionesService ) {
    this.datos.readDatoLocal( 'KRpt_Susa_usuario' ).
      then( dato => { this.usuario = dato; console.log( dato ); } );
   }

  ngOnInit() {
    console.log('ngOnInit Ventas002', this.usuario );
    this.datos.getReport( { reporte: 2,
                            empresa: '01',
                            sucursal: '001' } )
        .subscribe( data => { this.cargaDatos( data ); },
                    err  => { this.funciones.descargaEspera(); this.funciones.msgAlert( 'ATENCION', err ); }
                  );
  }

  cargaDatos( data ) {
    const total = [0, 0, 0, 0, 0];
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
      const eje       = [ ['Semanas', 'Atendidos'],
                          ['', 0],
                          ['', 0],
                          ['', 0],
                          ['', 0] ];
      const eje_table = [];
      //
      rs.forEach( element => {
        // Y-titulos de grafico
        tit0 = element.peri0.substring(0, 5) ;
        tit1 = element.peri1.substring(0, 5) ;
        tit2 = element.peri2.substring(0, 5) ;
        tit3 = element.peri3.substring(0, 5) ;
        //
        eje[1][0] = element.peri0 ; eje[1][1] += element.visitas0;
        eje[2][0] = element.peri1 ; eje[2][1] += element.visitas1;
        eje[3][0] = element.peri2 ; eje[3][1] += element.visitas2;
        eje[4][0] = element.peri3 ; eje[4][1] += element.visitas3;
        //
        eje_table.push( [ element.vendedor,
                          { v: element.promedio, f: element.promedio.toFixed(0).toString() },
                          { v: element.visitas0, f: element.visitas0.toFixed(0).toString() },
                          { v: element.visitas1, f: element.visitas1.toFixed(0).toString() },
                          { v: element.visitas2, f: element.visitas2.toFixed(0).toString() },
                          { v: element.visitas3, f: element.visitas3.toFixed(0).toString() },
                          element.nombreven.substring(0, 12 ) ] );
        total[0] += element.visitas0;
        total[1] += element.visitas1;
        total[2] += element.visitas2;
        total[3] += element.visitas3;
      });
      //
      total[4] = ( total[0] + total[1] + total[2] + total[3] ) / 4;
      eje_table.push( [ '>>>',
                        {v: total[4], f: total[4].toFixed(0).toString() },
                        {v: total[0], f: total[0].toFixed(0).toString() },
                        {v: total[1], f: total[1].toFixed(0).toString() },
                        {v: total[2], f: total[2].toFixed(0).toString() },
                        {v: total[3], f: total[3].toFixed(0).toString() },
                        'Totales' ] );

      // grafica de barras
      const datos = google.visualization.arrayToDataTable( eje );
      const opciones = {
        title:      'Visitas últimas 4 semanas',
        chartArea:  { width: '50%'},
        hAxis:      { title: 'Total de Visitas', minValue: 0 },
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
