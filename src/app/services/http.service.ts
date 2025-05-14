import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  httpClient = inject(HttpClient);

  constructor() {}

  traerPreguntaTrivia() {
    return this.httpClient.get<any>(
      'https://opentdb.com/api.php?amount=1&type=multiple'
    );
  }
}
 