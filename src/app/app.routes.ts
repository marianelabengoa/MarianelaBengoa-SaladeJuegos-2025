import { Routes } from '@angular/router';
import{BienvenidaComponent} from './pages/bienvenida/bienvenida.component'
import{LoginComponent} from './pages/login/login.component'
import{QuiensoyComponent} from './pages/quiensoy/quiensoy.component'
import{RegistroComponent} from './pages/registro/registro.component'

export const routes: Routes = 
[
    {path: '', component: BienvenidaComponent},

    {path: 'login', component: LoginComponent},

    {path: 'bienvenida', component: BienvenidaComponent},

    {path: 'quiensoy', component: QuiensoyComponent},
    
    {path: 'registro', component: RegistroComponent}
];
