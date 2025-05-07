import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DatabaseService } from '../../services/database.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  email: string = '';
  password: string = '';
  nombre: string = '';
  apellido: string = '';
  edad: number | null = null;
  errorMsg: string = '';

  constructor(private dbService: DatabaseService, private router: Router) {}

  async registrar() {
    if (!this.email || !this.password || !this.nombre || !this.apellido || this.edad === null) {
      this.errorMsg = 'Todos los campos son obligatorios.';
      return;
    }

    const resultado = await this.dbService.registrar(this.email, this.password, this.nombre, this.apellido, this.edad);

    if (resultado && resultado.error) {
      console.error('Error al registrar:', resultado.error.message);
      this.errorMsg = 'Ya existe una cuenta con ese email o ocurrió un error.';
    } else {
      console.log('Registro exitoso');

      const loginResultado = await this.dbService.login(this.email, this.password);

      if (loginResultado && loginResultado.error) {
        console.error('Error al iniciar sesión:', loginResultado.error.message);
        this.errorMsg = 'Registro exitoso, pero error al iniciar sesión.';
      } else {
        this.router.navigate(['/bienvenida']);
      }
    }
  }
}
