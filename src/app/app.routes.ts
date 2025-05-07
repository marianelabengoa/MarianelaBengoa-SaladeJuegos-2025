import { Routes } from '@angular/router';
import { BienvenidaComponent } from './pages/bienvenida/bienvenida.component';
import { LoginComponent } from './pages/login/login.component';
import { QuiensoyComponent } from './pages/quiensoy/quiensoy.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { AhorcadoComponent } from './pages/ahorcado/ahorcado.component';
import { MayorOMenorComponent } from './pages/mayor-o-menor/mayor-o-menor.component';
import { SecuenciaMusicalComponent } from './pages/secuencia-musical/secuencia-musical.component';

export const routes: Routes = [
  { path: '', component: BienvenidaComponent },
  { path: 'login', component: LoginComponent },
  { path: 'bienvenida', component: BienvenidaComponent },
  { path: 'quiensoy', component: QuiensoyComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'ahorcado', component: AhorcadoComponent },
  { path: 'mayor-o-menor', component: MayorOMenorComponent },
  { path: 'secuencia-musical', component: SecuenciaMusicalComponent },
  { path: '**', redirectTo: 'bienvenida', pathMatch: 'full' }
];

