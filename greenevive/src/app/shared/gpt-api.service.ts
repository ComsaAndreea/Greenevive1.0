import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import OpenAI from "openai";


@Injectable({
  providedIn: 'root'
})
export class GptAPIService {



  private apiUrl = '';
  private apiKey = 'xxx';

  constructor(private http: HttpClient, private firestore: Firestore) { }


  async generateFunFacts(userId: string, activities: any[]) :Promise<Observable<string>> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    });

    const transformedActivities = this.transformActivitiesToStrings(activities);
    const body = {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are an assistant that provides fun facts and suggestions for reducing carbon footprint based on user activities.' },
        { role: 'user', content: `Generate one fun fact or one suggestion to reduce carbon footprint for a user that has done the following activities:\n${transformedActivities.join('\n')} \nIf there are no activities, generate one fun fact for reducing carbon footprint.` }
      ],
      temperature: 1,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    };
    console.log(activities);
    console.log("Generate one fun fact or one suggestion based on the following activities:\n"+transformedActivities.join('\n')+"\nIf there are no activities, generate one fun fact for reducing carbon footprint.")
    try {
      const response = await this.http.post<any>(this.apiUrl, body, { headers }).toPromise();
      const funFact = response.choices[0].message.content.trim();
      return from(Promise.resolve(funFact));
    } catch (error) {
      return from(Promise.reject(this.handleError(error)));
    }
  }



  // async generateFunFacts2(userId: string, activities: any[]): Promise<Observable<string>> {
    
  //   const openai = new OpenAI({
  //     apiKey: this.apiKey,
  //   });

  //   const response = await openai.chat.completions.create({
  //     model: "gpt-3.5-turbo",
  //     messages: [
  //           { role: 'system', content: 'You are an assistant that provides fun facts and suggestions for reducing carbon footprint based on user activities.' },
  //           { role: 'user', content: `Generate one fun fact or one suggestion based on the following activities:\n\n${transformedActivities.join('\n')}` }
  //     ],
  //     temperature: 1,
  //     max_tokens: 256,
  //     top_p: 1,
  //     frequency_penalty: 0,
  //     presence_penalty: 0,
  //   });
  //   // const headers = new HttpHeaders({
  //   //   'Authorization': `Bearer ${this.apiKey}`,
  //   //   'Content-Type': 'application/json'
  //   // });
    
  //   // const transformedActivities = this.transformActivitiesToStrings(activities);
  //   // const body = {
  //   //   model: 'gpt-3.5-turbo',  // Adjusted to the GPT-3.5 turbo model
  //   //   messages: [
  //   //     { role: 'system', content: 'You are an assistant that provides fun facts and suggestions for reducing carbon footprint based on user activities.' },
  //   //     { role: 'user', content: `Generate one fun fact or one suggestion based on the following activities:\n\n${transformedActivities.join('\n')}` }
  //   //   ],
  //   //   max_tokens: 150,
  //   // };

  //   // return this.http.post<any>(this.apiUrl, body, { headers }).pipe(
  //   //   map(response => {
  //   //     const funFact = response.choices[0].message.content;
  //   //     // this.saveFunFactToFirebase(funFact, userId).catch(console.error);
  //   //     return funFact;
  //   //   }),
  //   //   catchError(this.handleError)
  //   // );


  // }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError('Something went wrong. Please try again later.');
  }

  private transformActivitiesToStrings2(activities: any[]): string[] {
    return activities.map(activity => {
      let description = '';
      if (activity.date) {
        description += `On date ${activity.date.toDate().toLocaleDateString()}`;
      }
      if (activity.type && activity.car_type) {
        description += ` travel by ${activity.type} ${activity.car_type}`;
      }
      if (activity.distance) {
        description += ` for ${activity.distance} km`;
      }
      return description;
    });
  }

  private transformActivitiesToStrings(activities: any[]): string[] {
    const firstFiveActivities = activities.slice(0, 5);
    return firstFiveActivities.map(activity => {
      let description='';
      if(activity.date){
        // description += `On date ${activity.date.toDate()}`;
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        const formattedDate = activity.date.toDate().toLocaleDateString('en-US', options);
        description += ` ${formattedDate}`;
      }
      if(activity.type && activity.car_type){
        description += ` travel by ${activity.type} ${activity.car_type}`;
      }
      if (activity.distance) {
        description += ` for ${activity.distance} km`;
      }
      return description;
    });
  }

  // private async saveFunFactToFirebase(funFact: string, userId: string) {
  //   const funFactsCollection = collection(this.firestore, 'FunFacts');
  //   await addDoc(funFactsCollection, {
  //     text: funFact,
  //     author: "",
  //     userId: userId
  //   });
  // }
}
