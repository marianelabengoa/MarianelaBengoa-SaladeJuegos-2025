import { Component, OnInit } from '@angular/core';
import { SoundService } from '../../../app/services/sound.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-secuencia-musical',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './secuencia-musical.component.html',
  styleUrls: ['./secuencia-musical.component.css']
})
export class SecuenciaMusicalComponent implements OnInit {
  colores: string[] = ['red', 'green', 'blue', 'yellow'];
  secuencia: number[] = [];
  inputUsuario: number[] = [];
  enTurnoJugador: boolean = false;
  nivel: number = 0;
  mensaje: string = '';
  notasActivas: boolean[] = [];
  juegoIniciado: boolean = false;

  constructor(private soundService: SoundService) {}

  ngOnInit(): void {}

  comenzar() {
    this.juegoIniciado = true;
    this.reiniciar();
  }

  reiniciar() {
    this.secuencia = [];
    this.nivel = 0;
    this.mensaje = '';
    this.nuevaRonda();
  }

  nuevaRonda() {
    this.enTurnoJugador = false;
    this.inputUsuario = [];
    this.secuencia.push(this.randomNota());
    this.reproducirSecuencia();
  }

  randomNota(): number {
    return Math.floor(Math.random() * 4);
  }

  async reproducirSecuencia() {
    for (let i = 0; i < this.secuencia.length; i++) {
      await this.delay(600);
      this.notasActivas[this.secuencia[i]] = true; 
      this.soundService.playSound(this.secuencia[i]);
      await this.delay(400); 
      this.notasActivas[this.secuencia[i]] = false;
    }
    this.enTurnoJugador = true;
  }

  onClickNota(nota: number) {
    if (!this.enTurnoJugador) return;

    this.soundService.playSound(nota);
    this.inputUsuario.push(nota);

    const index = this.inputUsuario.length - 1;
    if (this.inputUsuario[index] !== this.secuencia[index]) {
      this.mensaje = '¡Perdiste! Nivel alcanzado: ' + this.nivel;
      this.enTurnoJugador = false;
      return;
    }

    if (this.inputUsuario.length === this.secuencia.length) {
      this.nivel++;
      setTimeout(() => this.nuevaRonda(), 1000);
    }
  }

  delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
