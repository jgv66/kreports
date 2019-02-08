import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './pages/home/home.module#HomePageModule' },
  { path: 'menu', loadChildren: './pages/menu/menu.module#MenuPageModule' },
  { path: 'ventas001', loadChildren: './pages/ventas001/ventas001.module#Ventas001PageModule' },  { path: 'ventas002', loadChildren: './pages/ventas002/ventas002.module#Ventas002PageModule' },
  { path: 'ventas003', loadChildren: './pages/ventas003/ventas003.module#Ventas003PageModule' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
