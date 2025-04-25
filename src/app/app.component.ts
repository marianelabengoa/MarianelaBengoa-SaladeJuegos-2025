import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { DatabaseService } from './services/database.service';
import {HttpClientModule} from '@angular/common/http';
import {HttpClient} from '@angular/common/http';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true
})
export class AppComponent {
  constructor(private http: HttpClient)
  {

  }
  ngOnInit()
  {
  }

  getUsers()
  {
    return this.http.get('https://api.github.com/users?per_page=20');
  }

  getUser(username:string)
  {
    return this.http.get('https://api.github.com/users/'+username.toString());
  }

  title = 'Sala De Juegos';
  databaseService=inject(DatabaseService);
}
