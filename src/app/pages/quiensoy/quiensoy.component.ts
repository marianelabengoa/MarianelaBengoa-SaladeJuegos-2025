import { Component,OnInit } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {HttpClient} from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quiensoy',
  imports: [ HttpClientModule,CommonModule],
  templateUrl: './quiensoy.component.html',
  styleUrl: './quiensoy.component.css',
  standalone:true
})
export class QuiensoyComponent {

  userName:string="marianelabengoa";
  user:any;
  error:string='';

  constructor(private http: HttpClient)
  {

  }

  ngOnInit()
  {
    this.usuarioGitHub();
  }

  usuarioGitHub()
  {
    this.http.get('https://api.github.com/users/marianelabengoa')
    .subscribe(data=>{
      this.user=data;
    })
  }

}
