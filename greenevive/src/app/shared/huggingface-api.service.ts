import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { Observable, catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HuggingfaceApiService {

  private apiUrl = 'https://api-inference.huggingface.co/models/gpt2'; // API endpoint-ul Hugging Face
  private apiKey = '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'; // Înlocuiește cu API key-ul tău Hugging Face

  constructor(private http: HttpClient, private firestore: Firestore) { }

  generateFunFacts(userId: string, activities: any[]){
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    });

    const transformedActivities = this.transformActivitiesToStrings(activities);
    const body = {
      inputs: `Generate one suggestion for reducing carbon footprint knowing that a person did the following activities :\n\n${transformedActivities.join('\n')}`,
    };

    return this.http.post<any>(this.apiUrl, body, { headers })
    .pipe(
      map(response => {
        console.log("Raspunsul:" +JSON.stringify(response));
        console.log("Raspunsul nerafinat2:" +response[0].generated_text);
        const startIndex = response[0].generated_text.indexOf('km\n\n') + 'km\n\n'.length;
        const extractedText = response[0].generated_text.substring(startIndex);
        console.log('Textul extras:', extractedText);

        const funFact = response.generated_text;
        this.saveFunFactToFirebase(funFact, userId).catch(console.error);
        return funFact;
      }),
      catchError(this.handleError)
    );
    // return body.inputs;
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError('Something went wrong. Please try again later.');
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

  private async saveFunFactToFirebase(funFact: string, userId: string) {
    const funFactsCollection = collection(this.firestore, 'FunFacts');
    await addDoc(funFactsCollection, {
      text: funFact,
      author: '',
      userId: userId
    });
  }


}
