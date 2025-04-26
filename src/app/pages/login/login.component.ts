import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from '../../services/database.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMsg: string = '';

  constructor(private dbService: DatabaseService, private router: Router, private appcomponent: AppComponent) {}

  async login() {
    if (!this.email || !this.password) {
      this.errorMsg = 'Correo y contraseña son obligatorios.';
      return;
    }

    const { data, error } = await this.dbService.login(this.email, this.password);

    if (error) {
      console.error('Error al iniciar sesión:', error.message);
      this.errorMsg = 'Error: ' + (error.message || 'Credenciales incorrectas.');
    } else {
      console.log('Inicio de sesión exitoso');
      this.appcomponent.usuarioLogueado=true;
      this.router.navigate(['/bienvenida']);
    }
  }

  // ✨ Método para login rápido
  loginRapido(usuario: number) {
    switch (usuario) {
      case 1:
        this.email = 'marianela@gmail.com';
        this.password = '123456';
        break;
      case 2:
        this.email = 'manuel@gmail.com';
        this.password = '123456';
        break;
      case 3:
        this.email = 'guadalupe@gmail.com';
        this.password = '123456';
        break;
    }

    // Llamar directamente al método login
    this.login();
  }
}
