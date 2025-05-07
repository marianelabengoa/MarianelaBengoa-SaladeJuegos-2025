import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

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


  constructor() {
    this.inicializarJuego();
  }

  inicializarJuego() {
    this.errores = 0;

    this.letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const palabras = ['ANGULAR', 'AHORCADO', 'JUEGO', 'PROGRAMACION', 'COMPONENTE', ];
    this.palabraSecreta = palabras[Math.floor(Math.random() * palabras.length)];
    this.palabraOculta = '_'.repeat(this.palabraSecreta.length);
    this.intentosRestantes = 5;
    this.juegoTerminado = false;
    this.mensaje = '';
  }

  seleccionarLetra(letra: string) {
    if (this.juegoTerminado) return;

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
      this.mensaje = '¡Ganaste!';
      this.juegoTerminado = true;
    } else if (this.intentosRestantes <= 0) {
      this.mensaje = `¡Perdiste! La palabra era: ${this.palabraSecreta}`;
      this.juegoTerminado = true;
    }
  }
}
