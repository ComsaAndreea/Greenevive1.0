import { Component, OnInit } from '@angular/core';
import { Timestamp, addDoc, collection, getFirestore, setDoc } from '@angular/fire/firestore';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Activity } from './../Models/activity';
import { ActivitiesService } from './../shared/activities.service';
import { query, orderBy, limit } from "firebase/firestore"; 
import * as firebase from 'firebase/compat';
import {doc,deleteDoc} from "firebase/firestore";
import { environment } from '../../environments/environment';
import { initializeApp } from '@angular/fire/app';
import { getAuth, onAuthStateChanged } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActionSheetController, ToastController } from '@ionic/angular';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})

export class Tab3Page {

  segment: string = 'activities';
  activitiesFromDB: any=null; //constructor
  habitsFromDB: any=null;
  dateChange: boolean[] = [];
  app = initializeApp(environment.firebase);
  db = getFirestore(this.app);
  auth: any;
  userId: any;
  tab_uid : any;
  UID: string='' ;
  
  searchQuery: any;
  activitiesService: any;
  firestore: any;
  // activity:any[]=[];
  filteredActivities: Array<any> = [];
  filteredHabits: Array<any> = [];

  
  constructor(private activityService: ActivitiesService, private router: Router, private route: ActivatedRoute, private actionSheetCtrl: ActionSheetController, private toastController: ToastController) { 
    this.filteredActivities = this.activitiesFromDB;
    //this.ionViewWillEnter();
  }

  ngOnInit(){
    this.route.paramMap.subscribe((params:any) => {
      this.segment = params.get('selectedSegment');
      console.log(this.segment);
    }); 
    if(this.segment!='habits'){
      this.segment='activities';
    }
  }
  
  ionViewWillEnter() {
    if(this.segment!='habits'){
      this.segment='activities';
    }
    this.activityService.getActivities().subscribe((data) => {
      this.activitiesFromDB = data.sort((a,b) => {
        return b.date - a.date;
      });
      this.filteredActivities = data;
    });

    this.activityService.getHabits().subscribe((data)=>{
      this.habitsFromDB = data.sort((a,b) => {
        return b.date - a.date;
      });
      this.filteredHabits = data;
    })
    // this.filteredActivities = this.activitiesFromDB;
    //alert(this.activitiesFromDB[0].type);

    this.getUID();
    console.log(this.UID);
    console.log(this.UID);
    
  }  

  canDismiss = async (habitId:any) => {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Are you sure you want to delete this habit?',
      buttons: [
        {
          text: 'Yes',
          role: 'confirm',
        },
        {
          text: 'No',
          role: 'cancel',
        },
      ],
    });

    actionSheet.present();

    const { role } = await actionSheet.onWillDismiss();

    if(role == 'confirm'){
      this.delete_habit(habitId);
      this.presentToast("Habit deleted!");
    }
  };

  canDismiss_activity = async (act_id:any) => {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Are you sure you want to delete this activity?',
      buttons: [
        {
          text: 'Yes',
          role: 'confirm',
        },
        {
          text: 'No',
          role: 'cancel',
        },
      ],
    });

    actionSheet.present();

    const { role } = await actionSheet.onWillDismiss();

    if(role == 'confirm'){
      this.delete_act(act_id);
      this.presentToast("Activity deleted!");
    }
  };

  schimbaPagina(event: any){
    this.segment = event.detail.value;
    this.activityService.getActivities().subscribe((data) => {
      this.activitiesFromDB = data.sort((a,b) => {
        return b.date - a.date;
      });
      this.filteredActivities = data;
    });

    this.activityService.getHabits().subscribe((data)=>{
      this.habitsFromDB = data.sort((a,b) => {
        return b.date - a.date;
      });
      this.filteredHabits = data;
    })
  }

  goToPage(pageName:string){
    this.router.navigate([`${pageName}`]);
  }

  async delete_act(actid:any)
  {
    await deleteDoc(doc(this.db, "Activities",actid));

  }

  async delete_habit(habid:any)
  {
    await deleteDoc(doc(this.db, "Habits",habid));
  }

  edit_habit(hab:any){
    const params = {
      param1: hab.type, // Replace with your parameter values
      param2: hab.car_type,
      param3: hab.distance,
      param4: hab.label,
      param5: hab.habitID,
      param6: hab.userID,
      param7: true
    };
  
    // Navigate to the "habits" page with parameters
    this.router.navigate(['habits'], { queryParams: params });
  
  }

  public getUID()
  {
    //nu seteaza cum trebuie UID
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
    if (user) {
      
      let uid = user.uid;
      console.log("Eu sunt "+uid);
      this.UID=uid;

    } else {
      console.log("signed out");
    } });
  }
  

getfilteredActivities(event: any){
  const searchText = event.target.value.toLowerCase();
  this.activityService.getActivities().subscribe((a:  any ) => {
    let j = 0
    var a_1:Array<any> = [];
    for(let i in a){
      console.log(a[i])
      try{
        if(a[i].type.toLowerCase().includes(searchText) || a[i].label.toLowerCase().includes(searchText)){
          console.log("yay")
          a_1[j]= a[i]
          console.log(j);
          j = j + 1;
        }
      }catch(e){
        console.log(e);
      }
    }
    this.filteredActivities = a_1
  });

  this.activityService.getHabits().subscribe((a:  any ) => {
    let j = 0
    var a_1:Array<any> = [];
    for(let i in a){
      console.log(a[i])
      try{
        if(a[i].type.toLowerCase().includes(searchText) || a[i].label.toLowerCase().includes(searchText)){
          console.log("yay")
          a_1[j]= a[i]
          console.log(j);
          j = j + 1;
        }
      }catch(e){
        console.log(e);
      }
      
    }

    this.filteredHabits = a_1
  });
}

  async addActivity(act:any){
    console.log(act.distance +' '+act.type+' '+act.car_type+' '+act.pollution.carbonEquivalent)
  if (act.distance != undefined && act.type != undefined && act.car_type != undefined && act.pollution.carbonEquivalent != undefined ){//&& this.UID != undefined) {
    try {
      console.log(this.UID);

      const docRef = await addDoc(collection(this.db,"Activities"),{
      
      });
  console.log("Doc ID: ", docRef.id);
   

  const current = new Date();
    // current.setHours(0)
    // current.setMinutes(0)
    // current.setSeconds(0)
    // current.setMilliseconds(0)
    const timestamp = current.getTime();
    console.log(this.UID);

  const docRefs = {
    label:act.label,
    distance:act.distance,
    type:act.type,
    car_type:act.car_type,
    date:Timestamp.fromMillis(timestamp),
    pollution: {
      carbonEquivalent: act.pollution.carbonEquivalent
    },
    userID:this.UID,
    actID: docRef.id
  };
  console.log(this.UID);

  
    await setDoc(doc(this.db,"Activities",docRef.id),docRefs);
    console.log("Doc ID: ", docRef.id);
    console.log(act.pollution.carbonEquivalent);
    this.presentToast("Activity added!");

  } catch (error) {
    console.error("Error adding document:", error);
    // Handle error
  }
  } else {
    console.error("Data from API is null.");
    // Handle null data case
  }
}

async presentToast(message: string) {
  const toast = await this.toastController.create({
    message: message,
    duration: 2000,
    position: 'top'
  });
  toast.present();
}
}

