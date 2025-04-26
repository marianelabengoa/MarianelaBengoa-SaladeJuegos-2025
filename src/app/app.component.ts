import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { DatabaseService } from './services/database.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, HttpClientModule, CommonModule], // 👈 agregá CommonModule
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true
})
export class AppComponent implements OnInit {
  usuarioLogueado: boolean = false;
  title = 'Sala De Juegos';
  databaseService = inject(DatabaseService);

  constructor(private http: HttpClient,private dbService: DatabaseService) {}

  // async ngOnInit() {
  //   const { user, error } = await this.databaseService.obtenerUsuarioActual();
  //   this.usuarioLogueado = !!user; // 👈 Si hay user, está logueado
  // }
  async ngOnInit() {
    // Verificamos si el usuario está logueado
    const { user } = await this.dbService.obtenerUsuarioActual();
    this.usuarioLogueado = user ? true : false; // Si el usuario existe, está logueado
  }

  async logout() {
    await this.databaseService.logout();
    this.usuarioLogueado = false;
  }
}
