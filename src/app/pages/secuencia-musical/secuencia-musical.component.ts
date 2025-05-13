import { Component, OnInit } from '@angular/core';
import { SoundService } from '../../../app/services/sound.service';
import { CommonModule } from '@angular/common';
import { DatabaseService } from '../../services/database.service';

@Component({
  selector: 'app-secuencia-musical', 
  standalone: true,
  imports: [CommonModule],
  templateUrl: './secuencia-musical.component.html',
  styleUrls: ['./secuencia-musical.component.css'],
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
  juegoTerminado: boolean = false;
  vidas: number = 3;
  usuario: string = '';
  botonesError: boolean[] = [false, false, false, false];

  constructor(
    private soundService: SoundService,
    private db: DatabaseService
  ) {}

  async ngOnInit(): Promise<void> {
    const res = await this.db.obtenerUsuarioActual();
    this.usuario = res.user?.email ?? 'invitado';
  }
  comenzar() {
    this.juegoIniciado = true;
    this.vidas = 3;
    this.reiniciar();
  }

  reiniciar() {
    this.secuencia = [];
    this.inputUsuario = [];
    this.nivel = 0;
    this.mensaje = '';
    this.vidas = 3;
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
      this.vidas--;

      this.botonesError[nota] = true;
      setTimeout(() => (this.botonesError[nota] = false), 500);

      if (this.vidas <= 0) {
        this.mensaje = '¡Juego terminado! Nivel alcanzado: ' + this.nivel;
        this.enTurnoJugador = false;
        this.juegoTerminado=true;
        this.guardarResultado();
        return;
      } else {
        this.mensaje = `¡Error! Te quedan ${this.vidas} vidas.`;
        this.inputUsuario = [];
        this.enTurnoJugador = false;
        setTimeout(() => this.reproducirSecuencia(), 1000);
      }
      return;
    }

    if (this.inputUsuario.length === this.secuencia.length) {
      this.nivel++;
      this.mensaje = '';
      setTimeout(() => this.nuevaRonda(), 1000);
    }
  }

  delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  guardarResultado() {
    const nivel = this.nivel;

    this.db.guardarSecuencia(this.usuario, nivel).then((resp) => {
      if (resp.error) {
        console.error('Error al guardar en Supabase:', resp.error.message);
      } else {
        console.log('Resultado guardado:', resp.data);
      }
    });
  }
}
