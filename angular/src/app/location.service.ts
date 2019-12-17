import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from 'config';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  public options: {};
  constructor(private http: HttpClient) { }

  addLocation(data): Observable< any > {
    const responseType = 'json';
    this.options = {
      responseType
    };
    return this.http.post(AppConfig.baseUrlV1 + '/location', data, this.options)
    .pipe();
  }

  getLocationDetails(id): Observable< any > {
    const responseType = 'json';
    this.options = {
      responseType
    };
    return this.http.get(AppConfig.baseUrlV1 + `/location?id=${id}`, this.options)
    .pipe();
  }

  updateLocation(data): Observable< any > {
    const responseType = 'json';
    this.options = {
      responseType
    };
    return this.http.post(AppConfig.baseUrlV1 + '/location/update', data, this.options)
    .pipe();
  }

  getLocationsForUser(userId): Observable< any > {
    const responseType = 'json';
    this.options = {
      responseType
    };
    return this.http.get(AppConfig.baseUrlV1 + `/location/${userId}`, this.options)
    .pipe();
  }

  search(keyword): Observable< any > {
    const responseType = 'json';
    this.options = {
      responseType
    };
    return this.http.get(AppConfig.baseUrlV1 + `/location/name/search?keyword=${keyword}`, this.options)
    .pipe();
  }

  deleteLocation(id): Observable< any > {
    const responseType = 'json';
    this.options = {
      responseType
    };
    return this.http.post(AppConfig.baseUrlV1 + `/location/delete/${id}`, null, this.options)
    .pipe();
  }
}
