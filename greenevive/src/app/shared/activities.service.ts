import { Time } from '@angular/common';
import { Injectable } from '@angular/core';
import { AngularFirestore, QueryFn } from '@angular/fire/compat/firestore';
import { Timestamp, addDoc, collection } from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { Activity } from '../Models/activity';


@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {

  constructor(private firestore: AngularFirestore) { }
  
  getActivities(): Observable<any[]>{
    return this.firestore.collection('Activities').valueChanges();
  }
  getUserActivities(userID: string): Observable<Activity[]> {
    return this.firestore.collection<Activity>('Activities', ref => ref.where('userID', '==', userID)).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Activity;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }
  getHabits(): Observable<any[]>{
    return this.firestore.collection('Habits').valueChanges();
  }

  addActivity(activity: any){
    const myCollection = this.firestore.collection('Activities');
    myCollection.add(activity).then((docRef) => {
      alert('Document added with ID: '+ docRef.id);
    })
    .catch((error) => {
      alert('Error adding document: '+ error);
    });
    //alert("Activity Type="+activity.type);
  }
  

  // getLastActivity(uid: string){

  //   let final_activity = this.getMostRecentActivity(uid)
  //   .then(activity => {
  //     if (activity) {
  //       console.log('Most recent activity:', activity);
  //       return activity;
  //       // Access the relevant fields of the most recent activity
  //       // For example: console.log(activity.actId, activity.type);
  //     } else {
  //       console.log('No activities found for the userId');
  //       return null;
  //     }
  //   })
  //   .catch(error => {
  //     console.error('Error getting most recent activity:', error);
  //   });

  //   return final_activity;

  // }

  // getMostRecentActivity(userId: string): Promise<Activity | null> {
  //   const queryFn: QueryFn<Activity|any> = ref => ref.where('userID', '==', userId).limit(1);

  //   return this.firestore.collection<Activity>('Activities',queryFn)
  //     .get()
  //     .toPromise()
  //     .then((querySnapshot: any) => {
  //       if (!querySnapshot.empty) {
  //         // Return the first (and only) document found in the query result
  //         return querySnapshot.docs[0].data() as Activity;
  //       }
  //       return null; // If no activities found for the userId
  //     })
  //     .catch(error => {
  //       console.error('Error fetching most recent activity:', error);
  //       return null;
  //     });
  // }

}

