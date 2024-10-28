import { ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ApiService} from '../api.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { QuotesService } from '../shared/quotes.service';
import { Activity } from 'src/app/Models/activity';
import { ActivitiesService } from 'src/app/shared/activities.service';
import { AuthService } from '../shared/auth.service';
import { Observable, map, take } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, onAuthStateChanged } from '@angular/fire/auth';
import { PopoverController } from '@ionic/angular';
import { ActivityDetailsPopoverComponent } from '../activity-details-popover/activity-details-popover.component';


interface User{
  uid : string;
  email: string;
}
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{
  constructor(private popoverController: PopoverController, private fireauth: AngularFireAuth,private authService: AuthService, private activityService: ActivitiesService, private api: ApiService, private firestore: AngularFirestore,   private cdr: ChangeDetectorRef // Inject ChangeDetectorRef
  ) {}
  randomQuote: any = {};
  basicURL = 'https://carbonfootprint1.p.rapidapi.com/CarbonFootprintFromCarTravel';
  carbonFootprintData: any;
  distance: any;
  vehicle: any;
  activitiesFromDB: any;
  score: number=0;

  ngOnInit(){
    this.distance = 3550;
    this.vehicle = 'SmallDieselCar'
    //this.getDataFromApi();
    this.getRandomQuote();
    this.getUId();

    // this.activityService.getActivities().subscribe((data) => {
    //   const currentDate = new Date().setHours(0, 0, 0, 0); // Get the current date at midnight (without the time).
    //   this.activitiesFromDB = data.filter((a) => new Date(a.date.toDate()).setHours(0, 0, 0, 0) === currentDate);
    //   this.calculateTotalScore();
    // });

    this.activityService.getActivities().subscribe((data) => {
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0); // Set time to midnight to compare dates

      // const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0)); // Get the start of the current day.
      // const endOfDay = new Date(currentDate.setHours(23, 59, 59, 999)); // Get the end of the current day.
    
      const startOfDay = this.getStartOfWeek(currentDate);
      const endOfDay = this.getEndOfWeek(currentDate);
    
      this.activitiesFromDB = data
        .filter((a) => {
          const activityDate = a.date.toDate(); // Convert the Firestore timestamp to a JavaScript Date object.
          // Check if the activity date is within the start and end of the current day
          return activityDate >= startOfDay && activityDate <= endOfDay;
        })
        .sort((a, b) => b.date.toDate().getTime() - a.date.toDate().getTime()); // Sort by date and time in descending order
    
      this.calculateTotalScore();
    });

    
  }
  private getStartOfWeek(date: Date): Date {
    const day = date.getDay();
    const diff = day === 0 ? -6 : 1 - day; // Adjust when day is Sunday
    const resultDate = new Date(date);
    resultDate.setDate(date.getDate() + diff);
    return resultDate;
  }

  private getEndOfWeek(date: Date): Date {
    const day = date.getDay();
    const diff = date.getDate() + (6 - day); // Calculate days until end of the week (Sunday)
    return new Date(date.setDate(diff));
  }

  totalScore: number=0;
  calculateTotalScore() {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
        if (user) {
          let uid = user.uid;
          console.log(uid);
                
        // Fetch activities for the current user
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set time to midnight to compare dates

        const activitiesSnapshot = this.firestore
          .collection('Activities', ref =>
            ref.where('userID', '==', uid)
              .where('date', '>=', this.getStartOfWeek(today))
              .where('date', '<=', this.getEndOfWeek(today))
          )
          .valueChanges()
          .subscribe((activities: any[]) => {
            this.totalScore=0;
            if (activities.length > 0) {
              activities.forEach((activityDoc:any) => {
                this.totalScore += activityDoc.pollution.carbonEquivalent
                console.log("total: "+this.totalScore);
              });

            }
          });
          console.log("uid: "+uid);
      }
    });
  }

  // getUID() {
  //   this.fireauth.authState.subscribe(async (user) => {
  //     if(user){
  //       this.getLastActivity(user.uid);
  //     }
  //   })

  // }

  getRandomQuote() {
    this.firestore.collection('FunFacts').get().subscribe((querySnapshot) => {
      const quotes = querySnapshot.docs.map((doc) => doc.data());
      const randomIndex = Math.floor(Math.random() * quotes.length);
      this.randomQuote = quotes[randomIndex];
    });
  }   

  // a: any;

  UID: string='' ;
  public getUId()
  {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
  if (user) {
    
    let uid = user.uid;
    console.log(uid);
    this.UID=uid;
    

  } else {
    
    console.log("signed out");
    
  }});

  
  }

  async openActivityDetails(ev: any, activity: any) {
    const popover = await this.popoverController.create({
      component: ActivityDetailsPopoverComponent,
      event: ev,
      translucent: true,
      componentProps: { activity: activity }
    });
    return await popover.present();
  }
//   getLastActivity(uid:string){
//     alert(uid);
    
//     this.a = this.activityService.getMostRecentActivity(uid).then((result)=>{
//       console.log(result);
//     });
//     console.log(this.a);
//     //this.getUID();
//   }
//   // getDataFromApi():void {
//   //   this.api.getCarbonFootprint(this.distance,this.vehicle).subscribe((result) => {
//   //     this.carbonFootprintData = result;
//   //   });
//   // } 

  
}
