import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  public itemes_Sucursales: Array<{ titulo: string, page: string, item: string }> = [
    /*{ titulo: 'Ventas por Sucursal', page: 'ventas001', item: 'Mes actual' },*/
    { titulo: 'Ventas mes actual',  page: 'ventas001', item: 'Facturacion Vendedores' },
    { titulo: 'Ventas mes actual',  page: 'ventas002', item: 'Visitas últimas 4 semanas' },
    { titulo: 'Ventas mes actual',  page: 'ventas003', item: 'Ventas últimas 4 semanas' }
    /*{ titulo: 'Ventas mes actual', page: 'ventas001', item: 'Total, Mes actual' },*/
  ];

public itemes_SucPasado: Array<{ titulo: string, page: string, item: string }> = [
    { titulo: 'Ventas por Sucursal Histórico', page: 'ventap001', item: 'Reporte 1' },
    { titulo: 'Ventas por Sucursal Histórico', page: 'ventap001', item: 'Reporte 2' },
    { titulo: 'Ventas por Sucursal Histórico', page: 'ventap001', item: 'Reporte 3' },
    { titulo: 'Ventas por Sucursal Histórico', page: 'ventap001', item: 'Reporte 4' },
  ];

  constructor() { }

  ngOnInit() {
  }

}

