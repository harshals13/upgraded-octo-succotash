import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfig } from 'config';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public options: {};

  constructor(private http: HttpClient) { }

  login(data): Observable< any > {
    const responseType = 'json';
    this.options = {
      responseType
    };
    return this.http.post(AppConfig.baseUrlV1 + '/user/login', data, this.options)
    .pipe();
  }

  register(data): Observable< any > {
    const responseType = 'json';
    this.options = {
      responseType
    };
    return this.http.post(AppConfig.baseUrlV1 + '/user', data, this.options)
    .pipe();
  }

}
