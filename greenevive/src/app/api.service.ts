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
  apiKey = '4a3f4ebcd4msh9832d9bdab7a457p1df500jsn56422ab19166';
  //apiKey = '58ae19afa9msh62c0c6da7bd8222p1a8d7ejsn6133c617909f'; //asta merge
  //apiKey = '4a3f4ebcd4msh9832d9bdab7a457p1df500jsn56422ab19166'; //Andreea final

  constructor(private http:HttpClient) { }

  getCarbonFootprintFromCar(distance: string,vehicle:string): Observable<any> {
    const headers = new HttpHeaders()
    .set('X-RapidAPI-Key','4a3f4ebcd4msh9832d9bdab7a457p1df500jsn56422ab19166')
    .set('X-RapidAPI-Host','carbonfootprint1.p.rapidapi.com');


    // 'X-RapidAPI-Key': '6c95d0fc40msh10ef7ecb5eb6bdap11f442jsnd57f13f60550',
    //   'X-RapidAPI-Host': 'carbonfootprint1.p.rapidapi.com'


    const params = new HttpParams()
      .set('distance',distance.toString())
      .set('vehicle',vehicle);

    return this.http.get<any>(this.carURL, {headers, params }).pipe(catchError((error: any) => this.handleError(error)));
  }
  getCarbonFootprintFromFlight(distance: string,type:string): Observable<any> {
    const headers = new HttpHeaders()
    .set('X-RapidAPI-Key','4a3f4ebcd4msh9832d9bdab7a457p1df500jsn56422ab19166')
    .set('X-RapidAPI-Host','carbonfootprint1.p.rapidapi.com');

    const params = new HttpParams()
      .set('distance',distance.toString())
      .set('type',type);

    return this.http.get<any>(this.flightURL, {headers, params }).pipe(catchError((error: any) => this.handleError(error)));
  }
  getCarbonFootprintFromPublicTransport(distance: string,type:string): Observable<any> {
    const headers = new HttpHeaders()
    .set('X-RapidAPI-Key','4a3f4ebcd4msh9832d9bdab7a457p1df500jsn56422ab19166')
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

