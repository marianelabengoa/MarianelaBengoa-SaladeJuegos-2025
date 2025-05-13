import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-bienvenida',
  standalone: true,
  templateUrl: './bienvenida.component.html',
  styleUrl: './bienvenida.component.css',
  imports: [CommonModule],
})
export class BienvenidaComponent implements OnInit {
  usuario: any = null;

  constructor(
    private dbService: DatabaseService,
    private router: Router,
    private appcomponent: AppComponent
  ) {}

  async ngOnInit() {
    const { user, error } = await this.dbService.obtenerUsuarioActual();
    if (user) {
      this.usuario = user;
    }
  }

  async logout() {
    await this.appcomponent.logout();
    this.usuario = null;
    this.router.navigate(['/login']);
  }

  navegarA(path: string) {
    this.router.navigate([path]);
  }
}
