import { Routes } from '@angular/router';
import { BienvenidaComponent } from './pages/bienvenida/bienvenida.component';
import { LoginComponent } from './pages/login/login.component';
import { QuiensoyComponent } from './pages/quiensoy/quiensoy.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { AhorcadoComponent } from './pages/ahorcado/ahorcado.component';
import { MayorOMenorComponent } from './pages/mayor-o-menor/mayor-o-menor.component';
import { SecuenciaMusicalComponent } from './pages/secuencia-musical/secuencia-musical.component';
import { PreguntadosComponent } from './pages/preguntados/preguntados.component';
import { ResultadosComponent } from './pages/resultados/resultados.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: BienvenidaComponent },
  { path: 'login', component: LoginComponent },
  { path: 'bienvenida', component: BienvenidaComponent },
  { path: 'quiensoy', component: QuiensoyComponent },
  { path: 'registro', component: RegistroComponent },
  {
    path: 'ahorcado',
    loadComponent: () =>
      import('./pages/ahorcado/ahorcado.component').then(
        (m) => m.AhorcadoComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'mayor-o-menor',
    loadComponent: () =>
      import('./pages/mayor-o-menor/mayor-o-menor.component').then(
        (m) => m.MayorOMenorComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'secuencia-musical',
    loadComponent: () =>
      import('./pages/secuencia-musical/secuencia-musical.component').then(
        (m) => m.SecuenciaMusicalComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'preguntados',
    loadComponent: () =>
      import('./pages/preguntados/preguntados.component').then(
        (m) => m.PreguntadosComponent
      ),
    canActivate: [AuthGuard],
  },
  { path: 'resultados', component: ResultadosComponent },
  { path: '**', redirectTo: 'bienvenida', pathMatch: 'full' },
];
