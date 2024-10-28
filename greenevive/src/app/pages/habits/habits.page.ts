import { Component, OnInit } from '@angular/core';
import { initializeApp } from '@angular/fire/app';
import { getAuth, onAuthStateChanged } from '@angular/fire/auth';
import { Timestamp, addDoc, collection, doc, getDoc, getFirestore, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Activity } from 'src/app/Models/activity';
import { ApiService } from 'src/app/api.service';
import { ActivitiesService } from 'src/app/shared/activities.service';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-habits',
  templateUrl: './habits.page.html',
  styleUrls: ['./habits.page.scss'],
})
export class HabitsPage implements OnInit {


  type = '';
  carType = '';
  flightType= '';
  publicTransportType = '';
  distanceKm : string = '0';
  carbonFootprintData: any;
  carbonData: any;
  habit_name= '';
  habitID= '';
  editingLabel: string = "Add Habit";
  subtitle="Add new habit";
  icon_name="add-circle-outline";

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

  edit: boolean = false;

  constructor(private route: ActivatedRoute,private activityService: ActivitiesService, private router: Router, private api: ApiService) {
    // Retrieve the parameters from ActivatedRoute
    this.route.queryParams.subscribe(params => {
      // Access the parameters as needed
      this.edit = params['param7'];
      this.type = params['param1'];
      this.carType = params['param2'];
      this.distanceKm = params['param3'];
      this.habit_name = params['param4'];
      this.habitID = params['param5'];
      this.UID = params['param6'];
      if(this.edit == true){
        this.editingLabel='Edit';
        this.subtitle='Edit habit';
        this.icon_name='create-outline';
      }
      // Use the parameters in your page
    });
  }
  


  ngOnInit() {
    this.activityService.getActivities().subscribe((data) => {
      this.activitiesFromDB = data;
    });
    //this.groupActivities();
    //this.getDataFromApi();
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

  

  goToTab3Habits(){
    this.router.navigate(['tabs/tab3', 'habits']);
  }

  getHabitName(){
    console.log('Habit name: ', this.habit_name);
  }
  getSelectedType(){
    console.log('Selected type: ', this.type);
  }
  getSelectedCar(){
    console.log('Selected car: ',this.carType);
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



async createHabit()
{
  await this.getUID();
  console.log(this.UID+'\n'+this.distanceKm+'\n'+this.type+'\n'+this.carType+'\n'+this.carbonData)

  await this.getDataFromApi();
  console.log(this.UID+'\n'+this.distanceKm+'\n'+this.type+'\n'+this.carType+'\n'+this.carbonData)
  if (this.distanceKm != undefined && this.type != undefined && this.carType != undefined && this.carbonData != undefined ){//&& this.UID != undefined) {
    try{
      const data = this.carbonData;
      console.log("CARBON:",data);
    
      // const docRef = await addDoc(collection(this.db,"Habits"),{
       
      // });
      console.log("Uau");


    
      const current = new Date();
        // current.setHours(0)
        // current.setMinutes(0)
        // current.setSeconds(0)
        // current.setMilliseconds(0)
        const timestamp = current.getTime();
    
      const docRefs = {
        label:this.habit_name,
        distance:this.distanceKm,
        type:this.type,
        car_type:this.carType,
        date:Timestamp.fromMillis(timestamp),
        pollution:this.carbonData,
        userID:this.UID,
        habitID: this.habitID,
      };
      let habitDocRef:any;
      let habitSnapshot:any;
      try{
      habitDocRef = doc(this.db, "Habits", this.habitID);
      habitSnapshot = await getDoc(habitDocRef);
      }
      catch (error){
        habitSnapshot=null;
      }
      if (habitSnapshot!=null) {
        // Documentul există, actualizează-l
        await setDoc(habitDocRef, docRefs, { merge: true });
        console.log("Habit updated with ID: ", this.habitID);
      } else {
        // Documentul nu există, creează unul nou
        const newDocRef = await addDoc(collection(this.db, "Habits"), {});
        docRefs.habitID = newDocRef.id;

        await setDoc(doc(this.db,"Habits",newDocRef.id),docRefs);
        console.log("Doc ID: ", newDocRef.id);
      }
      console.log(this.carbonData);
      let element:HTMLElement = document.getElementById('cancel') as HTMLElement;
      element.click();
    } catch (error){
      console.error("Error adding document:",error);
    }
  }else{
    console.error("Data from API is null.");
    // Handle null data case
  }
}






}
