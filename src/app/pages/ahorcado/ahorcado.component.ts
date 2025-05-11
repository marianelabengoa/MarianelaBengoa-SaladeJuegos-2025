import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatabaseService } from '../../services/database.service'; // Asegúrate de importar el servicio

@Component({
  selector: 'app-ahorcado',
  standalone: true,
  templateUrl: './ahorcado.component.html',
  styleUrls: ['./ahorcado.component.css'],
  imports: [CommonModule]
})
export class AhorcadoComponent {
  letras: string[] = []; 
  palabraSecreta: string = '';
  palabraOculta: string = '';
  intentosRestantes: number = 5;
  juegoTerminado: boolean = false;
  mensaje: string = '';

  fila1 = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
  fila2 = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
  fila3 = ['Z', 'X', 'C', 'V', 'B', 'N', 'M'];

  errores: number = 0;
  aciertos: number = 0;

  letrasSeleccionadas: string[] = [];

  erroresTotales:number = 0;
  usuario: string = 'Jugador1'; 

  constructor(private dbService: DatabaseService) {
  this.dbService.obtenerUsuarioActual().then(res => {
    if (res.user) {
      this.usuario = res.user.email ?? 'Invitado';
    }
  });
  this.inicializarJuego();
}

  inicializarJuego() {
    this.errores = 0;
    
    this.letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const palabras = ['ANGULAR', 'AHORCADO', 'JUEGO', 'PROGRAMACION', 'COMPONENTE'];
    this.palabraSecreta = palabras[Math.floor(Math.random() * palabras.length)];
    this.palabraOculta = '_'.repeat(this.palabraSecreta.length);
    this.intentosRestantes = 5;
    this.juegoTerminado = false;
    this.mensaje = '';
    this.letrasSeleccionadas = [];
  }

  seleccionarLetra(letra: string) {
    if (this.juegoTerminado || this.letrasSeleccionadas.includes(letra)) return;
  
    this.letrasSeleccionadas.push(letra);
  
    let acierto = false;
    let nuevaPalabraOculta = '';
  
    for (let i = 0; i < this.palabraSecreta.length; i++) {
      if (this.palabraSecreta[i] === letra) {
        nuevaPalabraOculta += letra;
        acierto = true;
      } else {
        nuevaPalabraOculta += this.palabraOculta[i];
      }
    }
  
    this.palabraOculta = nuevaPalabraOculta;
  
    if (!acierto) {
      this.intentosRestantes--;
      this.errores++;
    }
  
    this.verificarEstadoJuego();
  }
  
  verificarEstadoJuego() {
    if (this.palabraOculta === this.palabraSecreta) {
      this.aciertos++;
      this.mensaje = '¡Ganaste!';
      this.juegoTerminado = true;
  
      setTimeout(() => {
        this.inicializarJuego();
      }, 500);
  
    } else if (this.intentosRestantes <= 0) {
      this.mensaje = `¡Perdiste! La palabra era: ${this.palabraSecreta}`;
      this.juegoTerminado = true;
      
      this.dbService.guardarEstadisticas(this.usuario, this.aciertos, this.errores).then((res) => {
        if (res.error) {
          console.error('Error al guardar las estadísticas:', res.error.message);
        } else {
          console.log('Estadísticas guardadas exitosamente.');
        }
      });
  
      setTimeout(() => {
        this.aciertos=0;
        this.inicializarJuego();
      }, 500);
    }
  }  
}
