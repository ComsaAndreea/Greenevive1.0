import { Component, OnInit, OnDestroy } from '@angular/core';
import { QuotesService } from '../shared/quotes.service'
import { QuerySnapshot, query } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, user } from '@angular/fire/auth';
import { object, ref } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import { Observable, Subscription, asyncScheduler, take } from 'rxjs';
import { map } from 'rxjs';
import { DocumentSnapshot } from '@angular/fire/firestore';
import { first } from 'rxjs/operators';
import { ActionSheetController, ToastController } from '@ionic/angular';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit, OnDestroy{

  isDropdownOpen1 = true;
  isDropdownOpen2 = true;

  allUsers: any[] = [];
  myFriends: any[] = [];
  currentUserEmail: any = null;
  currentUserId: any = null;
  requestsFromMe: any[] = [];
  requestsForMe: any[] = [];
  segment: string = 'button1';
  filteredUsers: any[] = [];
  filteredFriends: any[] = [];
  filteredRequestsForMe: any[] = [];
  filteredRequestsFromMe: any[] = [];
  searchQuery: string = '';
  subscription$: Subscription = new Subscription;
  totalScore: { [id: string] : number; } = {};


  constructor(private firestore: AngularFirestore, private afAuth: AngularFireAuth, private toastController: ToastController,private actionSheetCtrl: ActionSheetController) {}

  ngOnInit() {
    this.retrieveData();
    
  }

  toggleDropdown1(): void {
    this.isDropdownOpen1 = !this.isDropdownOpen1;
  }
  toggleDropdown2(): void {
    this.isDropdownOpen2 = !this.isDropdownOpen2;
  }


  async retrieveData(){
    return new Promise<void>(async (resolve, reject) => {
      console.log("!!!!!!!!!! S-a initializat din nou componenta !!!!!!!!!!!!");
        await this.getCurrentUserEmailAndId();
        await Promise.all([
          this.getRequestsFromMe(),
          this.getRequestsToMe()
        ]);
      this.getAllUsers();
      // Listen for changes in the FriendRequest collection
      this.subscription$?.add(this.firestore.collection('FriendRequest').valueChanges().subscribe(() => {
      // Call getAllUsers() whenever there's a change in FriendRequest
      this.getAllUsers();
      }));
      await this.getUserFriends();
      console.log(this.currentUserId);
      console.log(this.currentUserEmail);
      console.log(this.myFriends);
      this.subscription$.add(this.firestore.collection('Activities').valueChanges().subscribe(() => {
        if(this.myFriends){
          this.myFriends.forEach(f => this.calculate(f.email));
        }
      }));
      resolve();
    });
  }

  async getEmailAndId(){
    return new Promise<void>((resolve, reject) => {
      this.subscription$.add(this.afAuth.authState.subscribe(user => {
        if (user) {
          this.currentUserEmail = user.email;
          this.currentUserId = user.uid;
          resolve();
        } else {
          // User not authenticated, handle accordingly
          this.currentUserEmail = null;
          this.currentUserId = null;
          reject();
        }
      }));
    });
  }

  ionViewWillEnter(){
    if(this.segment!='button2'){
      this.segment='button1';
    }
  }
  afisaza(){
    console.log(this.currentUserId);
    console.log(this.currentUserEmail);
    console.log("All Users: "+this.allUsers);
    console.log("Users length: "+this.allUsers.length);
    this.allUsers.forEach(user => {
      console.log(user.email);
    });
    console.log("My Friends: "+this.myFriends);
    this.myFriends.forEach(friend => {
      console.log(friend.email);
    });
    console.log("Requests from me: "+this.requestsFromMe);
    console.log("Requests for me: "+this.requestsForMe);
  }

  async getCurrentUserEmailAndId() {
    return new Promise<void>((resolve, reject) => {
    //   this.subscription$?.add(this.afAuth.authState.subscribe(user => {
    //     if (user) {
    //       console.log("FriendRequest collection changed!"); // Add this line
    //       this.currentUserEmail = user.email;
    //       this.currentUserId = user.uid;
    //       resolve();
    //     } else {
    //       reject(new Error('User not authenticated'));
    //     }
    //   }));
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.currentUserEmail = user.email;
        this.currentUserId = user.uid;
        resolve();
  
      } else {
        console.log("signed out");
        reject();
      } });
    });  
  }
  getAllUsers() {
    this.subscription$?.add(this.firestore.collection('Users').valueChanges().subscribe((users: any) => {
      // Filter out the current user and users the current user has sent requests to
      const filteredUsers = users.filter((user: any) => {
        return user.email !== this.currentUserEmail &&
               !this.requestsFromMe.includes(user.email) &&
               !this.requestsForMe.includes(user.email) &&
               !(user.friends && user.friends.includes(this.currentUserEmail));
      });
      
      this.allUsers = filteredUsers;
      this.filteredUsers = this.allUsers;
    }));
  }
  
  async getUserFriends(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const userRef = this.firestore.collection('Users').doc(this.currentUserId);
      this.subscription$?.add(userRef.valueChanges().subscribe((userData: any) => {
        if (userData && userData.friends) {
          const friendEmails = userData.friends;
          const friendPromises = friendEmails.map((friendEmail: string) => {
            // Query the Users collection to find the document with the specified email
            return this.firestore.collection('Users', ref => ref.where('email', '==', friendEmail))
              .valueChanges().pipe(first()).toPromise();
          });
    
          Promise.all(friendPromises).then((friendsData: any[]) => {
            const friends = friendsData.map(friend => friend[0]); // Extract the first document from each result
            console.log("All Friends: ", friends);
            this.myFriends = friends;
            this.filteredFriends = this.myFriends;
            resolve();
          }).catch(error => {
            console.error('Error fetching friend data:', error);
            reject(error);
          });
        } else {
          console.error('User data or friends list not found.');
          reject(new Error('User data or friends list not found.'));
        }
      }));
    });
  }
  async getRequestsFromMe(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.subscription$?.add(this.firestore.collection('FriendRequest', ref =>
        ref.where('FromId', '==', this.currentUserEmail)
      ).valueChanges().subscribe(requests => {
        this.requestsFromMe = requests.map((request: any) => request.ToId);
        this.filteredRequestsFromMe = this.requestsFromMe;
        resolve();
      }));
    });
  }
  
  async getRequestsToMe(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.subscription$?.add(this.firestore.collection('FriendRequest', ref =>
        ref.where('ToId', '==', this.currentUserEmail)
      ).valueChanges().subscribe(requests => {
        this.requestsForMe = requests.map((request: any) => request.FromId);
        this.filteredRequestsForMe = this.requestsForMe;
        resolve();
      }));
    });
  }
  
  friendshipRequested(userEmail: string): boolean {
    return this.requestsFromMe.includes(userEmail);
  }
  friendRequest(friendEmail: string){
    console.log("Sunt in *FriendRequest*");
    const requestRef = this.firestore.collection('FriendRequest')
    .doc(`${this.currentUserEmail}_${friendEmail}`);
    // Check if the document already exists
    this.subscription$?.add(requestRef.get().subscribe(docSnapshot => {
      if (!docSnapshot.exists) {
        // If the document doesn't exist, add it
        requestRef.set({
          FromId: this.currentUserEmail,
          ToId: friendEmail
        }, { merge: true }); // Use merge to update or create
      }
    }));
    this.presentToast("Friend request sent to "+friendEmail);

  }
  cancelFriendRequest(friendEmail: string) {
    this.subscription$?.add(this.firestore.collection('FriendRequest', ref =>
      ref.where('FromId', '==', this.currentUserEmail)
         .where('ToId', '==', friendEmail)
    ).get().subscribe(querySnapshot => {
      querySnapshot.forEach(doc => {
        doc.ref.delete();
      });
    }));
  }
  
acceptFriendRequest(friendEmail: string) {
  // First, get the current user's document reference
  const userRef = this.firestore.collection('Users').doc(this.currentUserId);

  // Update the current user's friend list with the new friendEmail
  userRef.update({
    friends: firebase.firestore.FieldValue.arrayUnion(friendEmail)
  }).then(() => {
    console.log(`Friend request from ${friendEmail} accepted successfully.`);
    
    // Get the friend's user ID using their email
    this.firestore.collection('Users').ref.where('email', '==', friendEmail).get().then((querySnapshot) => {
      if (!querySnapshot.empty) {
        // Assuming email is unique, there should be only one user with the specified email
        const friendUserId = querySnapshot.docs[0].id;
        console.log("Hei, vezi ca numai id-ul asta l-am gasit: "+friendUserId);
        // Update the friend's friend list with the current user's email
        const friendRef = this.firestore.collection('Users').doc(friendUserId);
        friendRef.update({
          friends: firebase.firestore.FieldValue.arrayUnion(this.currentUserEmail)
        }).then(() => {
          console.log(`Friend ${this.currentUserEmail} added successfully.`);
        }).catch((error) => {
          console.error('Error adding friend:', error);
        });
      } else {
        console.log('Friend not found with the provided email.');
      }
    }).catch((error) => {
      console.error('Error retrieving friend data:', error);
    });
  }).catch((error) => {
    console.error('Error accepting friend request:', error);
  });
  this.deleteFriendRequest(friendEmail);
}
  
  deleteFriendRequest(friendEmail: string){
    this.subscription$?.add(this.firestore.collection('FriendRequest', ref =>
      ref.where('FromId', '==', friendEmail)
         .where('ToId', '==', this.currentUserEmail)
    ).get().subscribe(querySnapshot => {
      querySnapshot.forEach(doc => {
        doc.ref.delete();
      });
    }));
  }
  RemoveFriend(friendEmail: string){
      // Remove friendEmail from the currentUser's friends list
    const currentUserRef = this.firestore.collection('Users').doc(this.currentUserId);
    currentUserRef.update({
      friends: firebase.firestore.FieldValue.arrayRemove(friendEmail)
    })
    .then(() => {
      console.log(`Successfully removed ${friendEmail} from currentUser's friends list`);
      // Find the document of the user with email friendEmail
      this.subscription$?.add(this.firestore.collection('Users', ref => ref.where('email', '==', friendEmail))
        .get()
        .subscribe(querySnapshot => {
          querySnapshot.forEach(doc => {
            // Delete currentUserEmail from the found user's friends list
            doc.ref.update({
              friends: firebase.firestore.FieldValue.arrayRemove(this.currentUserEmail)
            })
            .then(() => {
              console.log(`Successfully removed ${this.currentUserEmail} from ${friendEmail}'s friends list`);
            })
            .catch(error => {
              console.error('Error removing currentUserEmail from friendEmail\'s friends list:', error);
            });
          });
        }));
    })
    .catch(error => {
      console.error('Error removing friendEmail from currentUser\'s friends list:', error);
    });
  }
  searchUsers() {
    if (this.searchQuery && this.segment == 'button1') {
      this.filteredUsers = this.allUsers.filter(user =>
        user.username.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      // If search query is empty, display all users
      this.filteredUsers = this.allUsers;
    }
    if(this.searchQuery && this.segment == 'button2'){
      this.filteredRequestsForMe = this.requestsForMe.filter(req =>
        req.toLocaleLowerCase().includes(this.searchQuery.toLocaleLowerCase())
      )
      this.filteredRequestsFromMe = this.requestsFromMe.filter(req =>
        req.toLocaleLowerCase().includes(this.searchQuery.toLocaleLowerCase())
      )
    } else {
      this.filteredRequestsForMe = this.requestsForMe;
      this.filteredRequestsFromMe = this.requestsFromMe;
    }
    if(this.searchQuery && this.segment == 'button3'){
      this.filteredFriends = this.myFriends.filter(friend =>
        friend.username.toLowerCase().includes(this.searchQuery.toLocaleLowerCase()) ||
        friend.email.toLocaleLowerCase().includes(this.searchQuery.toLocaleLowerCase())
      );
      
    } else {
      this.filteredFriends = this.myFriends;
    }
  }

 async getUserIdByEmail(email: string): Promise<string | null> {
    try {
      const userRef = this.firestore.collection('Users', ref =>
        ref.where('email', '==', email).limit(1)
      );

      const querySnapshot = await userRef.get().toPromise();
      if (querySnapshot && querySnapshot.size > 0) {
        const doc = querySnapshot.docs[0];
        console.log(`Am gasit pt email ${email} id-ul ${doc.id}`);
        return doc.id;
      } else {
        console.error(`User with email ${email} not found.`);
        return Promise.reject(new Error(`User with email ${email} not found.`));
      }
    } catch (error) {
      console.error('Error retrieving user ID by email:', error);
      return Promise.reject(error);
    }
  }

  async calculate(friendEmail: string){
    this.totalScore[friendEmail] = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let friendId : any;
    friendId = await this.getUserIdByEmail(friendEmail);
    console.log("the id is: "+friendId);
    // this.firestore.collection('Activities').ref.where('userID', '==', friendId).where('date', '>=', today).
    // get().then((querySnapshot: any) => {
    //   console.log("am gasit o activitate de la userul acela "+querySnapshot);
    //   if (!querySnapshot.empty) {
    //     querySnapshot.docs.forEach((doc: any) => {
    //       const xDate = doc.data().date.toDate();
    //       if(xDate.getFullYear() === today.getFullYear() &&
    //       xDate.getMonth() === today.getMonth() &&
    //       xDate.getDate() === today.getDate()){
    //       // Access each activity's carbonEquivalent and log the value
    //         console.log("Carbon Equivalent:", doc.data().pollution.carbonEquivalent);
    //         this.totalScore[friendEmail] += doc.data().pollution.carbonEquivalent;
    //       }
    //     });
    //   }else{
    //       console.log("No activities found for the user.");
    //   }
    // });
    // Calculate the start and end of the current week
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)); // Monday of the current week
      startOfWeek.setHours(0, 0, 0, 0); // Set time to the start of the day

      const endOfWeek = new Date(today);
      endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday of the current week
      endOfWeek.setHours(23, 59, 59, 999); // Set time to the end of the day

      this.firestore.collection('Activities').ref
        .where('userID', '==', friendId)
        .where('date', '>=', startOfWeek)
        .where('date', '<=', endOfWeek)
        .get()
        .then((querySnapshot: any) => {
          console.log("Activities found for the user:");

          if (!querySnapshot.empty) {
            querySnapshot.docs.forEach((doc: any) => {
              const xDate = doc.data().date.toDate();
              console.log("Carbon Equivalent:", doc.data().pollution.carbonEquivalent);
              this.totalScore[friendEmail] += doc.data().pollution.carbonEquivalent;
            });
          } else {
            console.log("No activities found for the user.");
          }
        });

        // Assuming email is unique, there should be only
  }

  async schimbaPagina(event: any){
    await this.retrieveData();
    console.log("Sunt in *schimbaPagina* segment="+this.segment);
    this.segment = event.detail.value;
    this.searchQuery = '';
  }


  canDismiss = async (email:any) => {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Are you sure you want to delete your friend?',
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
      this.RemoveFriend(email);
    }
  };

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000, // Durata în milisecunde pentru afișarea Toast-ului
      position: 'top' // Poziția pe ecran unde va fi afișat Toast-ul (bottom, middle, top)
    });
    toast.present();
  }

  ngOnDestroy(){
    this.subscription$?.unsubscribe();
  }


}
