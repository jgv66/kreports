import { Component } from '@angular/core';
import { DatosService } from '../../services/datos.service';
import { Router } from '@angular/router';
import { FuncionesService } from 'src/app/services/funciones.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  email     = '';
  pssw      = '';
  empresa   = '';
  empresas  = [];
  usuarios  = [];

  constructor(  private datos: DatosService,
                private funciones: FuncionesService,
                private router: Router ) {}

  ngOnInit() {
    this.datos.getDataEmpresas().subscribe( data => { this.empresas = data['datos'];
                                                      console.log( data['datos'] );  } );  // todo el configp
    this.usrdata();
  }

  async usrdata() {
    const usr = await this.datos.readDatoLocal( 'KRpt_Susa_usuario' )
        .then(  data => { try {
                            this.email = data.EMAIL;
                          } catch (error) {
                            this.email = '';
                          }
                        },
                error => { console.log(error); } );
  }

  doLogin() {
    if ( this.email === '' || this.pssw === '' ) {
      this.funciones.msgAlert('Datos vacíos', 'Debe ingresar correo y clave para verificar accesos.' );
    } else {
      this.datos.getVerificar( {  caso:     'usuario',
                                  email:    this.email.trim(),
                                  pssw:     this.pssw.trim(),
                                  empresa:  '01' } )
        .subscribe( data => {
                    console.log(111111, data);
                    const rs = data['recordsets'][0];
                    console.log(2222222, rs);
                    if ( rs[0].usuario ) {
                      //
                      this.datos.saveDatoLocal( 'KRpt_Susa_usuario', rs[0] );
                      // perfecto !!!. entrega un array con el dato filtrado (santa)
                      // console.log( (this.empresas).filter( (e) => e.codigo === this.empresa ) );
                      this.empresas.forEach( element => {
                        if ( element.codigo === this.empresa ) {
                          this.datos.saveDatoLocal( 'KRpt_Susa_empresa', element.razonsocial );
                        }
                      });
                      //
                      this.router.navigate( ['/menu'] );
                    }
      },
      err => {
        console.error('ERROR. verifique credenciales', err);
      });
    }
  }

}

