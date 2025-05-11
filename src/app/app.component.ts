import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { DatabaseService } from './services/database.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ChatComponent } from "../app/pages/chat/chat.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, HttpClientModule, CommonModule, ChatComponent], 
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true
})
export class AppComponent implements OnInit {
  mostrarChat: boolean = false;
  usuarioLogueado: boolean = false;
  title = 'Sala De Juegos';
  databaseService = inject(DatabaseService);

  constructor(private http: HttpClient,private dbService: DatabaseService) {}

  async ngOnInit() {
    const { user } = await this.dbService.obtenerUsuarioActual();
    this.usuarioLogueado = user ? true : false;
  }

  async logout() {
    await this.databaseService.logout();
    this.usuarioLogueado = false;
  }

  mostrarBarraChat() {
    this.mostrarChat = !this.mostrarChat;
    console.log('Estado del chat:', this.mostrarChat);
  }
  
  
}
