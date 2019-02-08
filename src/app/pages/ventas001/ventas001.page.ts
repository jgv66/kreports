import { Component, OnInit, ViewChild } from '@angular/core';
import { DatosService } from 'src/app/services/datos.service';
import { FuncionesService } from 'src/app/services/funciones.service';

declare var google;

@Component({
  selector: 'app-ventas001',
  templateUrl: './ventas001.page.html',
  styleUrls: ['./ventas001.page.scss'],
})
export class Ventas001Page implements OnInit {

  usuario = '';

  constructor(  private datos: DatosService,
                private funciones: FuncionesService ) {
    this.datos.readDatoLocal( 'KRpt_Susa_usuario' ).
      then( dato => { this.usuario = dato; console.log( dato ); } );
   }

  ngOnInit() {
    console.log('ngOnInit Ventas001', this.usuario );
    this.datos.getReport( { reporte: 1,  /* ksp_rpt_vtas_ven_tot */
                            empresa: '01',
                            sucursal: '001' } )
        .subscribe( data => { this.cargaDatos( data ); },
                    err  => { this.funciones.descargaEspera(); this.funciones.msgAlert( 'ATENCION', err ); } 
                  );
  }

  cargaDatos( data ) {
    let total = 0;
    const rs = data.datos;
    console.log( 'rs->', rs );
    if ( rs === undefined || rs.length === 0 ) {
      this.funciones.muestraySale('ATENCION : Período y sucursales no presentan datos para representar', 2 );
    } else {
      // datos para xAxis
      const eje       = [];
      const eje_table = [];
      //
      rs.forEach( element => {
        if ( element.ventas > 0 ) {
          eje.push( [ element.vendedor, element.ventas / 1000000 ] );
        }
        eje_table.push( [ element.vendedor,
                          { v: element.ventas,
                            f: (element.ventas / 1000000).toFixed(2).toString() },
                          element.nombreven ] );
        total += element.ventas;
      });
      //
      eje_table.push( [ '>>>', {v: total, f: (total / 1000000).toFixed(2).toString() }, 'Totales' ] );
      // crear el grafico de pie
      const data_pie = new google.visualization.DataTable();
          data_pie.addColumn('string', 'Vendedor');
          data_pie.addColumn('number', 'Venta');
          data_pie.addRows( eje );
      // Instantiate and draw our chart, passing in some options.
      const pie_chart = new google.visualization.PieChart(document.getElementById('pie_chart_div'));
      const options   = { title: 'Mes actual : ' + this.funciones.nombreMes( rs[0].mes ),
                        'width': '100%',
                        'height': '100%',
                        'chartArea': { 'left': '10', 'top': '20', 'bottom': '50', 'width': '150%', 'height': '100%'},
                        };
      pie_chart.draw(data_pie, options );

      // tabla representando los datos
      const data_table = new google.visualization.DataTable();
          data_table.addColumn('string', 'Ven.');
          data_table.addColumn('number', 'Monto');
          data_table.addColumn('string', 'Descripción');
          data_table.addRows( eje_table );
      const table = new google.visualization.Table(document.getElementById('table_div'));
      table.draw(data_table, {showRowNumber: false, width: '100%', height: '100%'});

    }
  }

}
