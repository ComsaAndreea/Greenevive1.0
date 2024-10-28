import { Component, OnInit } from '@angular/core';
import { Timestamp, addDoc, collection, doc, getFirestore, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Activity } from 'src/app/Models/activity';
import { ActivitiesService } from 'src/app/shared/activities.service';
import {ApiService} from 'src/app/api.service';
import { getAuth, onAuthStateChanged } from '@angular/fire/auth';
import { initializeApp } from '@angular/fire/app';
import { environment } from 'src/environments/environment';
import { randomInt } from 'crypto';
import { NavParams } from '@ionic/angular';


@Component({
  selector: 'app-activities',
  templateUrl: './activities.page.html',
  styleUrls: ['./activities.page.scss'],
})
export class ActivitiesPage implements OnInit {

  type = '';
  carType = '';
  flightType= '';
  publicTransportType = '';
  distanceKm : string = '0';
  carbonFootprintData: any;
  carbonData: any;
  act_name='';
  estate: any | undefined;
  app = initializeApp(environment.firebase);
  db = getFirestore(this.app);
 

  public alertButtons = ['OK']
  

  a1: Activity = new Activity();
  activities: Activity[] = [
    this.a1, this.a1, this.a1
  ];

  segment: string = 'activities';
  activitiesFromDB!: any[]; //constructor
  dateChange: boolean[] = [];
  UID: any;

  constructor(private activityService: ActivitiesService, private router: Router, private api: ApiService) { }

  ngOnInit() {
    this.activityService.getActivities().subscribe((data) => {
      this.activitiesFromDB = data;
    });
    //this.groupActivities();
    //this.getDataFromApi();
  }

  goToPage(pageName: string) {
    // Define your parameters as a query string
    const params = {
      param1: this.type, // Replace with your parameter values
      param2: this.carType,
      param3: this.distanceKm,
      param4: this.act_name,
      param7: false
    };
  
    // Navigate to the "habits" page with parameters
    this.router.navigate([pageName], { queryParams: params });
  }
  

  schimbaPagina(event: any){
    this.segment = event.detail.value;
  }

  groupActivities(){
    this.activitiesFromDB.sort((a, b) => a.date.toMillis() - b.date.toMillis());
    alert("Sorted");
    let prevDate=new Timestamp(0,0);
    let i=0;
    for(let act of this.activitiesFromDB){
      if(prevDate != act.date){
        this.dateChange[i] = true;
        i++;
      }
      prevDate=act.date;
    }
    alert(this.activitiesFromDB);
  }

  getActName(){
    console.log("Activity name: ", this.act_name);
  }

  getSelectedType(){
    console.log('Selected type: ', this.type);
  }
  getSelectedCar(){
    console.log('Selected car: ' + this.carType);
  }
  getDistance(){
    console.log('Distance: ', this.distanceKm);
  }
  getSelectedFlight(){
    console.log("Selected flight: ",this.flightType);
  }
  getSelectedTransport(){
    console.log("Selected public transport: ",this.publicTransportType)
  }
  async getDataFromApi(): Promise<void>  {
    if(this.ActivityData()){

    try{      
    if(this.type == "Car"){
      this.api.getCarbonFootprintFromCar(this.distanceKm,this.carType).subscribe((result: any) => {
      this.carbonData = result;
      this.processCarbonData();
      
      });
      
    }else if(this.type == "Flight"){
      const result = await this.api.getCarbonFootprintFromFlight(this.distanceKm, this.carType).toPromise();
      this.carbonData = result;
      this.processCarbonData();
    } else if (this.type === "PublicTransport") {
      const result = await this.api.getCarbonFootprintFromPublicTransport(this.distanceKm, this.carType).toPromise();
      this.carbonData = result;
      this.processCarbonData();
    }
     
    } catch (error) {
      console.error('Error fetching carbon footprint data:', error);
      // Handle error appropriately (e.g., show error message)
    }
    //await this.processCarbonData(); // asta se sterge si ce e mai sus se decomenteaza si ar trebui sa functioneze RapidAPI
  } 
  }

  processCarbonData() {
    if (this.carbonData == undefined) {
      this.carbonData = {
        carbonEquivalent: 0//Math.floor(Math.random() * 200)
      };
    }
    // Now you can safely use this.carbonData
    console.log("Carbon Data random:", this.carbonData);
    // Further logic dependent on carbonData
  }

  ActivityData(){
    if(this.type == ''){
      alert("Please choose a type first!");
      return false;
    }else{
      if(this.carType == '' && this.flightType == '' && this.publicTransportType == ''){
        alert("Please choose a transport type!");
        return false;
      }
      else{
        if(Number(this.distanceKm) <= 0){
          alert("Please choose a valid distance!");
          return false;
        }
      }
    }
    return true;
  }

  public getUID()
  {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
  if (user) {
    
    let uid = user.uid;
    console.log(uid);
    this.UID=uid;
    

  } else {
    
    console.log("signed out");
    
  }
}
);

}


async createActivity()
{
  await this.getUID();

  await this.getDataFromApi();
  console.log("Distance: " +this.distanceKm + "\nType: " +this.type + "\nCarType: " +this.carType+ "\nCarbon data: " +this.carbonData+ "\nUser UID: " +this.UID);
  // Check if the fetched data is not null
  if (this.distanceKm != undefined && this.type != undefined && this.carType != undefined && this.carbonData != undefined ){//&& this.UID != undefined) {
    try {

 
  const data = this.carbonData;
  console.log("CARBON:",data);
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
    label:this.act_name,
    distance:this.distanceKm,
    type:this.type,
    car_type:this.carType,
    date:Timestamp.fromMillis(timestamp),
    pollution:this.carbonData,
    userID:this.UID,
    actID: docRef.id
  };
  console.log(this.UID);

  
    await setDoc(doc(this.db,"Activities",docRef.id),docRefs);
    console.log("Doc ID: ", docRef.id);
    console.log(this.carbonData);
    let element:HTMLElement = document.getElementById('cancel') as HTMLElement;
    element.click();
  } catch (error) {
    console.error("Error adding document:", error);
    // Handle error
  }
  } else {
    console.error("Data from API is null.");
    // Handle null data case
  }

  
}




}
