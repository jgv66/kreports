import { Component, OnInit, ViewChild } from '@angular/core';
import { DatosService } from 'src/app/services/datos.service';
import { FuncionesService } from 'src/app/services/funciones.service';
import { Chart } from 'chart.js';

declare var google;

@Component({
  selector: 'app-ventas001',
  templateUrl: './ventas001.page.html',
  styleUrls: ['./ventas001.page.scss'],
})
export class Ventas001Page implements OnInit {

  @ViewChild('barCanvas')   barCanvas;
  @ViewChild('lineCanvas')  lineCanvas;

  pieChart: any;
  lineChart: any;
  tabla: any;
  usuario = '';
  public vendedores  = [];
  public ventas      = [];

  constructor(  private datos: DatosService,
                private funciones: FuncionesService ) {
    this.datos.readDatoLocal( 'KRpt_Susa_usuario' ).
      then( dato => { this.usuario = dato; console.log( dato ); } );
   }

  ngOnInit() {
    console.log('ngOnInit Ventas01Page', this.usuario );
    this.datos.getReport( { reporte: 4,  /* ksp_rpt_vtas_ven_tot */
                            empresa: '01',
                            sucursal: '001' } )
        .subscribe( data => { this.cargaDatos( data ); },
                    err  => { this.funciones.descargaEspera(); this.funciones.msgAlert( 'ATENCION', err ); } 
                  );
  }

  limpiarDatos() {
    if ( this.pieChart && this.lineChart) {
      this.removeData( this.pieChart );
      this.removeData( this.lineChart );
    }
  }

  removeData( chart ) {
    chart.data.labels.pop();
    chart.data.datasets.pop();
    chart.update();
  }

  tortaChart( data ) {
    this.pieChart = new Chart( this.barCanvas.nativeElement, {
      type: 'pie',
      data: { data },
      options: { scales: { yAxes: [{ ticks: { beginAtZero: true } }] } }
    });
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

/*

        eje_table.push( [ element.sucursal, { v: element.ventas,
                                              f: this.funciones.formatoNumero((element.ventas / 1000000), 2, 'es', '$ ') },
                                              element.nombresuc ] );
      eje_table.push( [ '>>>', {v: total, f: this.funciones.formatoNumero( (total/1000000), 2, 'es', '$ ') }, 'Totales' ] );

  dibujarLineas( ventas ) {
    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
    type: 'line',
    data: {
      labels: [ '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
                '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'],
      datasets: [{
          data: ventas,
          label: 'Ventas x Hora',
          borderColor: '#3e95cd',
          fill: true
          },
          ]
      },
      options: {
      title: {
        display: false,
        text: 'Ventas por hora'
      }
    }
    });
  }

tortaChart( data ) {
    this.pieChart = new Chart( this.barCanvas.nativeElement, {
      type: 'pie',
      data: {
          labels: [],
          datasets: [ {
              label: 'Ventas',
              data: [],
              backgroundColor: [
                  'rgba(255, 99, 132, 0.9)',
                  'rgba(255, 159, 64, 0.9)'
              ],
              borderColor: [
                  'rgba(255,99,132,0)',
                  'rgba(54, 162, 235, 0)'
              ],
              borderWidth: 1
          } ]
      },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero: true
                  }
              }]
          }
      }
    });
  }



*/