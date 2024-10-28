import { Injectable } from '@angular/core';
import { HttpClient, HttpHandler, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { trowel } from '@igniteui/material-icons-extended';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  carURL = 'https://carbonfootprint1.p.rapidapi.com/CarbonFootprintFromCarTravel';
  flightURL = 'https://carbonfootprint1.p.rapidapi.com/CarbonFootprintFromFlight';
  publicTransportURL = 'https://carbonfootprint1.p.rapidapi.com/CarbonFootprintFromPublicTransit';
  apiKey = 'xxx'
  constructor(private http:HttpClient) { }

  getCarbonFootprintFromCar(distance: string,vehicle:string): Observable<any> {
    const headers = new HttpHeaders()
    .set('X-RapidAPI-Key','xxx')
    .set('X-RapidAPI-Host','carbonfootprint1.p.rapidapi.com');


    // 'X-RapidAPI-Key': 'xxx'
    //   'X-RapidAPI-Host': 'carbonfootprint1.p.rapidapi.com'


    const params = new HttpParams()
      .set('distance',distance.toString())
      .set('vehicle',vehicle);

    return this.http.get<any>(this.carURL, {headers, params }).pipe(catchError((error: any) => this.handleError(error)));
  }
  getCarbonFootprintFromFlight(distance: string,type:string): Observable<any> {
    const headers = new HttpHeaders()
    .set('X-RapidAPI-Key','xxx')
    .set('X-RapidAPI-Host','carbonfootprint1.p.rapidapi.com');

    const params = new HttpParams()
      .set('distance',distance.toString())
      .set('type',type);

    return this.http.get<any>(this.flightURL, {headers, params }).pipe(catchError((error: any) => this.handleError(error)));
  }
  getCarbonFootprintFromPublicTransport(distance: string,type:string): Observable<any> {
    const headers = new HttpHeaders()
    .set('X-RapidAPI-Key','xxx')
    .set('X-RapidAPI-Host','carbonfootprint1.p.rapidapi.com');

    const params = new HttpParams()
      .set('distance',distance.toString())
      .set('type',type);

    return this.http.get<any>(this.publicTransportURL, {headers, params }).pipe(catchError((error: any) => this.handleError(error)));
  }
  private handleError(error: any){
    console.error('An error occurred:', error);
    return throwError('Something went wrong. Please try again later.')
  }
  
}

