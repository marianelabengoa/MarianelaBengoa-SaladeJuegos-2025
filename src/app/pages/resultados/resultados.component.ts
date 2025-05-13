import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatabaseService } from '../../services/database.service';

@Component({
  selector: 'app-resultados',
  imports: [CommonModule],
  templateUrl: './resultados.component.html',
  styleUrl: './resultados.component.css',
})
export class ResultadosComponent implements OnInit {
  rankingAhorcado: any[] = [];
  rankingMayorMenor: any[] = [];
  rankingSecuencia: any[] = [];
  partidasPreguntados: any[] = [];

  constructor(private db: DatabaseService) {}

  async ngOnInit() {
    await this.cargarRankingAhorcado();
    await this.cargarRankingMayorMenor();
    await this.cargarRankingSecuencia();
    await this.cargarRankingPreguntados();
  }

  async cargarRankingAhorcado() {
    const { data, error } = await this.db
      .getClient()
      .from('ahorcado')
      .select('usuario, aciertos, errores, fecha')
      .order('aciertos', { ascending: false })
      .order('errores', { ascending: true })
      .order('fecha', { ascending: true });

    if (!error && data) {
      this.rankingAhorcado = await Promise.all(
        data.map(async (r, index) => {
          const nombre = await this.db.obtenerNombrePorCorreo(r.usuario);
          return {
            nombre: nombre || r.usuario,
            aciertos: r.aciertos,
            errores: r.errores,
            fecha: this.formatearFecha(r.fecha),
            esPrimerLugar: index === 0,
          };
        })
      );

      this.rankingAhorcado = this.rankingAhorcado.slice(0, 10);
    }
  }

  async cargarRankingPreguntados() {
    const { data, error } = await this.db
      .getClient()
      .from('preguntados')
      .select('usuario, aciertos, errores, fecha')
      .order('aciertos', { ascending: false })
      .order('errores', { ascending: true })
      .order('fecha', { ascending: true });

    if (!error && data) {
      this.partidasPreguntados = await Promise.all(
        data.map(async (r, index) => {
          const nombre = await this.db.obtenerNombrePorCorreo(r.usuario);
          return {
            nombre: nombre || r.usuario,
            aciertos: r.aciertos,
            errores: r.errores,
            fecha: this.formatearFecha(r.fecha),
            esPrimerLugar: index === 0,
          };
        })
      );

      this.partidasPreguntados = this.partidasPreguntados.slice(0, 10);
    }
  }

  async cargarRankingMayorMenor() {
    const { data, error } = await this.db
      .getClient()
      .from('mayor_menor')
      .select('usuario, aciertos, tiempo, fecha')
      .order('aciertos', { ascending: false })
      .order('tiempo', { ascending: true })
      .order('fecha', { ascending: true });

    if (!error && data) {
      this.rankingMayorMenor = await Promise.all(
        data.map(async (r, index) => {
          const nombre = await this.db.obtenerNombrePorCorreo(r.usuario);
          return {
            nombre: nombre || r.usuario,
            aciertos: r.aciertos,
            tiempo: r.tiempo,
            fecha: this.formatearFecha(r.fecha),
            esPrimerLugar: index === 0,
          };
        })
      );
      this.rankingMayorMenor = this.rankingMayorMenor.slice(0, 10);
    }
  }

  async cargarRankingSecuencia() {
    const { data, error } = await this.db
      .getClient()
      .from('secuencia')
      .select('usuario, nivel, fecha')
      .order('nivel', { ascending: false })
      .order('fecha', { ascending: true });

    if (!error && data) {
      this.rankingSecuencia = await Promise.all(
        data.map(async (r, index) => {
          const nombre = await this.db.obtenerNombrePorCorreo(r.usuario);
          return {
            nombre: nombre || r.usuario,
            nivel: r.nivel,
            fecha: this.formatearFecha(r.fecha),
            esPrimerLugar: index === 0,
          };
        })
      );
      this.rankingSecuencia = this.rankingSecuencia.slice(0, 10);
    }
  }
  formatearFecha(fecha: string): string {
    const date = new Date(fecha);

    const offsetDate = new Date(date.getTime() - 3 * 60 * 60 * 1000);

    return offsetDate.toLocaleString('es-AR');
  }
}
