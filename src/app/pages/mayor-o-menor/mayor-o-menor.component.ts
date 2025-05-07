import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mayor-o-menor',
  templateUrl: './mayor-o-menor.component.html',
  styleUrls: ['./mayor-o-menor.component.css'],
  imports: [CommonModule]
})
export class MayorOMenorComponent implements OnInit {
  barajaId: string = '';
  cartaActual: any = null;
  cartaSiguiente: any = null;
  puntaje: number = 0;
  mensaje: string = '';
  jugando: boolean = false;

  constructor() {}

  ngOnInit() {
    this.crearBaraja();
  }

  crearBaraja() {
    fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
      .then((response) => response.json())
      .then((data) => {
        this.barajaId = data.deck_id;
        this.iniciarJuego();
      });
  }

  iniciarJuego() {
    this.puntaje = 0;
    this.mensaje = '';
    this.jugando = true;
    this.obtenerCarta();
  }

  obtenerCarta() {
    if (!this.barajaId) return;

    fetch(`https://deckofcardsapi.com/api/deck/${this.barajaId}/draw/?count=1`)
      .then((response) => response.json())
      .then((data) => {
        if (data.cards && data.cards.length > 0) {
          if (!this.cartaActual) {
            this.cartaActual = data.cards[0]; 
            this.obtenerCarta(); 
          } else {
            this.cartaSiguiente = data.cards[0];
          }
        } else {
          this.terminarJuego();
        }
      });
  }

  convertirValorCarta(valor: string): number {
    if (valor === 'KING') {
      return 13;
    } else if (valor === 'QUEEN') {
      return 12;
    } else if (valor === 'JACK') {
      return 11;
    } else if (valor === 'ACE') {
      return 1;
    } else {
      return parseInt(valor);
    }
  }

  adivinarMayor() {
    if (!this.jugando || !this.cartaSiguiente) return;
  
    const valorCartaActual = this.convertirValorCarta(this.cartaActual.value);
    const valorCartaSiguiente = this.convertirValorCarta(this.cartaSiguiente.value);
  
    if (valorCartaSiguiente > valorCartaActual) {
      this.puntaje++;
      this.mensaje = '¡Correcto! La carta siguiente es mayor.';
    } else if (valorCartaSiguiente === valorCartaActual) {
      this.mensaje = 'Las cartas son iguales. No suma punto, pero continúa.';
    } else {
      this.mensaje = '¡Incorrecto! La carta siguiente no es mayor.';
      this.terminarJuego();
    }
  
    this.cartaActual = this.cartaSiguiente;
    this.obtenerCarta(); 
  }
  

  adivinarMenor() {
    if (!this.jugando || !this.cartaSiguiente) return;
  
    const valorCartaActual = this.convertirValorCarta(this.cartaActual.value);
    const valorCartaSiguiente = this.convertirValorCarta(this.cartaSiguiente.value);
  
    if (valorCartaSiguiente < valorCartaActual) {
      this.puntaje++;
      this.mensaje = '¡Correcto! La carta siguiente es menor.';
    } else if (valorCartaSiguiente === valorCartaActual) {
      this.mensaje = 'Las cartas son iguales. No suma punto, pero continúa.';
    } else {
      this.mensaje = '¡Incorrecto! La carta siguiente no es menor.';
      this.terminarJuego();
    }
  
    this.cartaActual = this.cartaSiguiente;
    this.obtenerCarta(); 
  }

  terminarJuego() {
    this.mensaje += ` El juego ha terminado. Tu puntaje final es ${this.puntaje}.`;
    this.jugando = false;
  }
}
