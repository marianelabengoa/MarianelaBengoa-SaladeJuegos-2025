import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpService } from '../../services/http.service';
import { DatabaseService } from '../../services/database.service';

@Component({
  selector: 'app-preguntados',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preguntados.component.html',
  styleUrls: ['./preguntados.component.css'],
})
export class PreguntadosComponent {
  httpService = inject(HttpService);

  pregunta = signal<string>('');
  respuestas = signal<string[]>([]);
  correcta = signal<string>('');
  resultado = signal<string>('');
  seleccion = signal<string | null>(null);
  aciertos = signal<number>(0);
  errores = signal<number>(0);
  database = inject(DatabaseService);

  async ngOnInit() {
    const nombre = await this.database.obtenerNombreDelUsuarioActual();
    if (nombre) {
      await this.database.iniciarNuevaPartidaPreguntados(nombre);
      this.cargarPregunta();
    }
  }
  async ngOnDestroy() {
    const nombre = await this.database.obtenerNombreDelUsuarioActual();
    if (nombre) {
      await this.database.finalizarPartidaPreguntados(nombre);
    }
  }

  cargarPregunta() {
    this.httpService.traerPreguntaTrivia().subscribe({
      next: (data) => {
        if (data.results.length === 0) {
          this.resultado.set('❌ No se pudo obtener una pregunta.');
          return;
        }

        const resultado = data.results[0];
        const pregunta = this.decodeHtml(resultado.question);
        const correcta = this.decodeHtml(resultado.correct_answer);
        const respuestas = [
          resultado.correct_answer,
          ...resultado.incorrect_answers,
        ].map(this.decodeHtml);
        const mezcladas = this.shuffle(respuestas);

        setTimeout(() => {
          this.pregunta.set(pregunta);
          this.correcta.set(correcta);
          this.respuestas.set(mezcladas);
          this.resultado.set('');
          this.seleccion.set(null);
        }, 6000);
      },
      error: (err) => {
        console.error('Error al traer la pregunta:', err);
        this.resultado.set('❌ Error al conectar con el servidor.');
      },
    });
  }

  async responder(opcion: string) {
    this.seleccion.set(opcion);
    const esCorrecta = opcion === this.correcta();

    if (esCorrecta) {
      this.aciertos.update((n) => n + 1);
    } else {
      this.errores.update((n) => n + 1);
    }

    const nombre = await this.database.obtenerNombreDelUsuarioActual();
    if (nombre) {
      await this.database.actualizarPreguntados(nombre, esCorrecta);
    }
  }

  shuffle(array: string[]): string[] {
    return array.sort(() => Math.random() - 0.5);
  }

  decodeHtml(html: string): string {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  }
}
