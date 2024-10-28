// import { Component, OnInit } from '@angular/core';
// import { QuotesService } from '../../shared/quotes.service';
// import firebase from 'firebase/compat/app';
// import 'firebase/compat/firestore';
// import { AngularFirestore } from '@angular/fire/compat/firestore';
// import { AuthService } from '../../shared/auth.service';
// import { AngularFireAuth } from '@angular/fire/compat/auth';
// import { map } from 'rxjs';
// import { GptAPIService } from 'src/app/shared/gpt-api.service';
// import { getAuth, onAuthStateChanged } from '@angular/fire/auth';
// import { ActivitiesService } from 'src/app/shared/activities.service';
// import { HuggingfaceApiService } from 'src/app/shared/huggingface-api.service';

// @Component({
//   selector: 'app-quotes',
//   templateUrl: './quotes.page.html',
//   styleUrls: ['./quotes.page.scss'],
// })
// export class QuotesPage implements OnInit {
//   segment: string = 'facts';
//   quotes!: any[];
//   isFavorite: boolean[] = [];
//   firestore: firebase.firestore.Firestore;
//   favoriteQuotes: any[] = [];
//   user$ = this.authService.getAuthUserData();
//   activities: any[] = [];

//   constructor(
//     private activityService: ActivitiesService,
//     private quoteService: QuotesService,
//     private authService: AuthService,
//     private openAiService: GptAPIService,
//     private huggingFaceService: HuggingfaceApiService

//   ) {
//     this.firestore = firebase.firestore();
//   }

  

//   async ngOnInit() {
//     this.quoteService.getQuotes().subscribe((data) => {
//       this.quotes = data;
//       this.isFavorite = this.quotes.map(() => true); 

//       this.loadFavoriteQuotesFromLocalStorage();
//       this.getUserFavoriteQuotes();
//     });
//     await this.getUId();
//     await this.getUserActivities(this.UID);
//     //await this.getFunFacts();
//     // for(let q in this.isFavorite){
//     //   console.log(q);
//     // }
//     // this.isFavorite.forEach((q)=>console.log(q));
//   }

//   schimbaPagina(event: any) {
//     this.segment = event.detail.value;
//     this.getUserFavoriteQuotes();
//   }

//   updateHeartIcon(quoteId: string) {
//     const index = this.quotes.findIndex((quote) => quote.quoteId === quoteId);
//     if (index !== -1) {
//       this.isFavorite[index] = this.isQuoteFavorite(quoteId);
//       console.log("Aaa="+this.isFavorite[index]);
//     //   for(let q in this.isFavorite){
//     //   console.log("Q="+this.isFavorite[q]);
//     // }
//       this.saveFavoriteQuotesToLocalStorage();
//     }
//   }

//   toggleFavorite(index: number) {
//     this.isFavorite[index] = !this.isFavorite[index];
//     const quote = this.quotes[index];

//     if (this.isFavorite[index]) {
//       //alert('add');
//       this.addFavorite(quote, index); 
//     } else {
//       //alert('remove');
//       console.log("index="+index+" quote="+quote);
//       this.removeFavorite(quote, index); 
//     }
//   }

//   isQuoteFavorite(quoteId: string): boolean {
//     console.log("Q="+this.favoriteQuotes.some((quote) => quote.quoteId === quoteId));
//     return this.favoriteQuotes.some((quote) => quote.quoteId === quoteId);
//   }

//   getLoggedUserId(): string {
//     const user = firebase.auth().currentUser;
//     // console.log(user?.uid);
//     return user ? user.uid : '';
//   }

//   saveFavoriteQuotesToLocalStorage() {
//     const userId = this.getLoggedUserId();
  
//     if (userId) {
//       const favoriteData = {
//         userId: userId,
//         isFavorite: this.isFavorite
//       };
//       localStorage.setItem('favoriteQuotes', JSON.stringify(favoriteData));
//     }
//   }
  
//   loadFavoriteQuotesFromLocalStorage() {
//     const storedFavoriteQuotes = localStorage.getItem('favoriteQuotes');
//     if (storedFavoriteQuotes) {
//       const favoriteData = JSON.parse(storedFavoriteQuotes);
//       if (favoriteData.userId === this.getLoggedUserId()) {
//         this.isFavorite = favoriteData.isFavorite;
//       }
//     }
//   }  

//   addFavorite(quote: any, index: number) {
//     this.firestore
//       .collection('FunFacts')
//       .where('text', '==', quote.text)
//       .where('author', '==', quote.author)
//       .get()
//       .then((querySnapshot) => {
//         querySnapshot.forEach((doc) => {
//           const quoteId = doc.id;
//           quote.quoteId = quoteId;
//           console.log('Am intrat in addFavorite.')
//           this.user$.subscribe((user) => {
//             if (user) {
//               console.log('Am verificat userul curent si voi adauga la el in favorite.')
//               const userId = user.uid;
//               this.firestore
//                 .collection('Users')
//                 .doc(userId)
//                 .update({ favorites: firebase.firestore.FieldValue.arrayUnion(quoteId) })
//                 .then(() => {
//                   console.log('Citatul a fost adăugat în favorite cu succes.');
//                   this.isFavorite[index] = true;
//                   this.saveFavoriteQuotesToLocalStorage(); 
//                 })
//                 .catch((error) => {
//                   console.error('A apărut o eroare la adăugarea citatului în favorite:', error);
//                 });
//             }
//           });
//         });
//       })
//       .catch((error) => {
//         console.error('A apărut o eroare la adăugarea quotes-ului în colecția "favorites":', error);
//       });
//   }

//   removeFavorite(quote: any, index: number) {
//     this.firestore
//     .collection('FunFacts')
//     .where('text', '==', quote.text)
//     .where('author', '==', quote.author)
//     .get()
//     .then((querySnapshot) => {
//       querySnapshot.forEach((doc) => {
//         const quoteId = doc.id;
//         quote.quoteId = quoteId;
    
//     //const quoteId = quote.quoteId;
//     console.log("QID="+quoteId);
//     this.user$.subscribe((user) => {
//       if (user) {
//         console.log();
//         const userId = user.uid;
  
//         this.firestore
//           .collection('Users')
//           .doc(userId)
//           .update({ favorites: firebase.firestore.FieldValue.arrayRemove(quoteId) })
//           .then(() => {
//             console.log('Citatul a fost eliminat din favorite cu succes.');
//             this.isFavorite[index] = false;
//             this.saveFavoriteQuotesToLocalStorage(); 
//             this.updateHeartIcon(quoteId);
//           })
//           .catch((error) => {
//             console.error('A apărut o eroare la eliminarea citatului din favorite:', error);
//           });
//       }
//     });
//     this.getUserFavoriteQuotes();
//   });});
//   }
  

//   getUserFavoriteQuotes() {
//     this.favoriteQuotes = [];

//     this.user$.subscribe((user) => {
//       if (user) {
//         const userId = user.uid;

//         const userRef = this.firestore.collection('Users').doc(userId);

//         userRef.get().then((doc) => {
//           if (doc.exists) {
//             const favorites = doc.data()?.['favorites'] || [];
//             favorites.forEach((quoteId: string) => {
//               this.firestore.collection('FunFacts').doc(quoteId).get().then((quoteDoc) => {
//                 if (quoteDoc.exists) {
//                   const quote = quoteDoc.data();
//                   if (quote != undefined) {
//                     quote['quoteId'] = quoteId;
//                   }
//                   this.favoriteQuotes.push(quote);
//                 }
//               });
//             });
//           }
//         });
//       }
//     });
//   }

//   UID: string='' ;
//   async getUId()
//   {
//   const auth = getAuth();
//   onAuthStateChanged(auth, (user) => {
//   if (user) {
    
//     let uid = user.uid;
//     console.log(uid);
//     this.UID=uid;

//   } else {
    
//     console.log("signed out");
    
//   }});
  
//   }
//   async getUserActivities(uid: any): Promise<any[]> {
//     return new Promise((resolve, reject) => {
//       this.activityService.getUserActivities(uid).subscribe(
//         data => {
//           this.activities = data.sort((a, b) => b.date.toDate().getTime() - a.date.toDate().getTime());
//           resolve(this.activities);
//         },
//         error => {
//           console.error('Error fetching activities:', error);
//           reject(error);
//         }
//       );
//     });
//   }

//   // async getFunFacts() {
//   //   await this.getUserActivities(this.UID);
//   //   await this.getUserActivities(this.UID);
//   //   this.openAiService.generateFunFacts(this.UID, this.activities).subscribe(response => {
//   //     this.quotes = response;
//   //     console.log(this.quotes);
//   //   });
//   //   // this.huggingFaceService.generateFunFacts(this.UID, this.activities).subscribe(response => {
//   //   //   this.quotes = response;
//   //   //   console.log(this.quotes);
//   //   // });
//   //   console.log(this.activities);
//   //   // console.log(this.openAiService.generateFunFacts(this.UID,this.activities));
//   //   // console.log(this.huggingFaceService.generateFunFacts(this.UID,this.activities));
//   // }
//   async getFunFacts() {
//     try {
//       await this.getUserActivities(this.UID); // Assuming getUserActivities retrieves user activities
//       await this.getUserActivities(this.UID); // Assuming you need to call it twice for some reason

//       this.openAiService.generateFunFacts(this.UID, this.activities).subscribe(response => {
//         this.quotes = response;
//         console.log(this.quotes);
//       });
//     } catch (error) {
//       console.error('Error fetching user activities or generating fun facts:', error);
//     }
//   }
// }





import { Component, OnInit } from '@angular/core';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../../shared/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GptAPIService } from 'src/app/shared/gpt-api.service';
import { getAuth, onAuthStateChanged } from '@angular/fire/auth';
import { ActivitiesService } from 'src/app/shared/activities.service';
import { HuggingfaceApiService } from 'src/app/shared/huggingface-api.service';
import { QuotesService } from 'src/app/shared/quotes.service';
import { ActionSheetController } from '@ionic/angular';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-quotes',
  templateUrl: './quotes.page.html',
  styleUrls: ['./quotes.page.scss'],
})
export class QuotesPage implements OnInit {
  segment: string = 'facts';
  quotes!: any[];
  isFavorite: boolean[] = [];
  firestore: firebase.firestore.Firestore;
  favoriteQuotes: any[] = [];
  user$ = this.authService.getAuthUserData();
  activities: any[] = [];

  aiquotes: string[] = []; // New variable to store AI quotes
  isDropdownOpen1: boolean = true;


  constructor(
    private activityService: ActivitiesService,
    private authService: AuthService,
    private openAiService: GptAPIService,
    private quoteService: QuotesService,
    private actionSheetCtrl: ActionSheetController,

  ) {
    this.firestore = firebase.firestore();
  }

  ngOnInit() {
    this.quoteService.getQuotes().subscribe(async (data) => {
      this.quotes = data;
      this.isFavorite = await this.quotes.map(() => false);
      await this.loadFavoriteQuotesFromLocalStorage();
      this.getUserFavoriteQuotes();
      this.loadAIQuotes(); // Load AI quotes after quotes are initialized

    });
    // this.getUId().then(() => {
    //   this.getFunFacts();
    // });
  }

  loadAIQuotes() {
    this.user$.subscribe((user) => {
      if (user) {
        const userId = user.uid;
        const userRef = this.firestore.collection('Users').doc(userId);

        userRef.get().then((doc) => {
          if (doc.exists) {
            const aiquotes = doc.data()?.['AIquotes'] || [];
            if (aiquotes.length > 0) {
              this.aiquotes = aiquotes;
            } else {
              // If AIquotes field doesn't exist, create it
              userRef.set({ AIquotes: [] }, { merge: true });
              this.aiquotes = [];
            }
          } else {
            // If user document doesn't exist, create it with AIquotes field
            userRef.set({ AIquotes: [] });
            this.aiquotes = [];
          }
        }).catch((error) => {
          console.error('Error fetching AI quotes:', error);
        });
      }
    });
  }


  async saveAIQuote(aiquote: string) {
    aiquote = aiquote.replace("Suggestion","\nSuggestion");
    const userId = await this.getLoggedUserId();
    if (this.UID) {
      const userRef = this.firestore.collection('Users').doc(this.UID);
      const userDoc = await userRef.get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        let updatedAIQuotes: string[] = [];
        if (userData?.['AIquotes']) {
          updatedAIQuotes = userData['AIquotes'];
        }
        updatedAIQuotes.push(aiquote);
        await userRef.update({ AIquotes: updatedAIQuotes });
        this.loadAIQuotes();
      } else {
        await userRef.set({ AIquotes: [aiquote] }, { merge: true });
      }
    }
  }


  async deleteAIquote(quoteText: string) {
    const userId = await this.getLoggedUserId();
    if (this.UID) {
      const userRef = this.firestore.collection('Users').doc(this.UID);
      const userDoc = await userRef.get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        if (userData?.['AIquotes']) {
          const updatedAIQuotes = userData['AIquotes'].filter((quote: string) => quote !== quoteText);
          await userRef.update({ AIquotes: updatedAIQuotes });
          console.log(`AI quote "${quoteText}" deleted successfully.`);
        }
      }
    }
    this.loadAIQuotes();
  }

  toggleDropdown1(): void {
    this.isDropdownOpen1 = !this.isDropdownOpen1;
  }

  canDismiss_aiquote = async (quote:any) => {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Are you sure you want to delete this AI generated quote?',
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
      this.deleteAIquote(quote);
    }
  };


  schimbaPagina(event: any) {
    this.segment = event.detail.value;
    this.getUserFavoriteQuotes();
    this.loadAIQuotes();
  }

  updateHeartIcon(quoteId: string) {
    const index = this.quotes.findIndex((quote) => quote.quoteId === quoteId);
    if (index !== -1) {
      this.isFavorite[index] = this.isQuoteFavorite(quoteId);
      console.log("Updated heart icon for quoteId:", quoteId);
      this.saveFavoriteQuotesToLocalStorage();
    }
  }

  toggleFavorite(index: number) {
    this.isFavorite[index] = !this.isFavorite[index];
    const quote = this.quotes[index];

    if (this.isFavorite[index]) {
      this.addFavorite(quote, index);
    } else {
      this.removeFavorite(quote, index);
      this.loadFavoriteQuotesFromLocalStorage();
    }
  }

  isQuoteFavorite(quoteId: string): boolean {
    return this.favoriteQuotes.some((quote) => quote.quoteId === quoteId);
  }

  UID: string = "";
  async getLoggedUserId(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const user = firebase.auth().currentUser;
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
      if (user) {
        this.UID = user.uid;
        resolve(user.uid);
      } else {
        reject(new Error('No user logged in.'));
      }
    });});
  }

  saveFavoriteQuotesToLocalStorage() {
    const userId = this.getLoggedUserId();
    if (userId) {
      const favoriteData = {
        userId: userId,
        isFavorite: this.isFavorite
      };
      localStorage.setItem('favoriteQuotes', JSON.stringify(favoriteData));
    }
  }

  // async loadFavoriteQuotesFromLocalStorage() {
  //   let uid = await this.getLoggedUserId();
  //   console.log("Sa stii ca user id e:"+this.UID)
  //   const storedFavoriteQuotes = localStorage.getItem('favoriteQuotes');
  //   if (storedFavoriteQuotes) {
  //     console.log(storedFavoriteQuotes);
  //     const favoriteData = JSON.parse(storedFavoriteQuotes);
  //     console.log(favoriteData);
  //     if (favoriteData.userId === this.UID) {
  //       this.isFavorite = favoriteData.isFavorite;
  //     }
  //   }
  // }

  async loadFavoriteQuotesFromLocalStorage() {
    try {
      console.log("suuunt");
      let uid = await this.getLoggedUserId(); // Assuming this returns a Promise<string> of the UID
      console.log("User ID:", this.UID);
  
      // Fetch user document from Firestore
      const userDoc = await this.firestore.collection('Users').doc(this.UID).get();
  
      if (userDoc.exists) {
        // Get favorites array from user document
        const favoriteIds = userDoc.data()?.['favorites'] || [];

      // Fetch FunFacts documents based on favoriteIds
      const promises = favoriteIds.map(async (id: string) => {
        const docSnapshot = await this.firestore.collection('FunFacts').doc(id).get();
        if (docSnapshot.exists) {
          return docSnapshot.data()?.['text'];
        }
        return null;
      });

      // Wait for all promises to resolve
      const favoriteTexts = await Promise.all(promises);

        console.log(favoriteTexts);
        // Initialize isFavorite array based on favorites array
        this.isFavorite = this.quotes.map(quote => favoriteTexts.includes(quote.text));
        
        console.log(this.quotes);
        console.log(this.isFavorite);
      } else {
        console.log("User document not found.");
        // Handle case where user document doesn't exist (optional)
        this.isFavorite = this.quotes.map(() => false); // Initialize isFavorite array to false
      }
  
    } catch (error) {
      console.error("Error loading favorite quotes:", error);
      // Handle error as needed
      this.isFavorite = this.quotes.map(() => false); // Initialize isFavorite array to false
    }
  }
  
  

  addFavorite(quote: any, index: number) {
    this.firestore
      .collection('FunFacts')
      .where('text', '==', quote.text)
      .where('author', '==', quote.author)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const quoteId = doc.id;
          this.user$.subscribe((user) => {
            if (user) {
              const userId = user.uid;
              this.firestore
                .collection('Users')
                .doc(userId)
                .update({ favorites: firebase.firestore.FieldValue.arrayUnion(quoteId) })
                .then(() => {
                  console.log('Quote added to favorites successfully.');
                  this.isFavorite[index] = true;
                  this.saveFavoriteQuotesToLocalStorage();
                })
                .catch((error) => {
                  console.error('Error adding quote to favorites:', error);
                });
            }
          });
        });
      })
      .catch((error) => {
        console.error('Error querying Firestore:', error);
      });
  }

  removeFavorite(quote: any, index: number) {
    this.firestore
      .collection('FunFacts')
      .where('text', '==', quote.text)
      .where('author', '==', quote.author)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const quoteId = doc.id;
          this.user$.subscribe((user) => {
            if (user) {
              const userId = user.uid;
              this.firestore
                .collection('Users')
                .doc(userId)
                .update({ favorites: firebase.firestore.FieldValue.arrayRemove(quoteId) })
                .then(() => {
                  console.log('Quote removed from favorites successfully.');
                  this.isFavorite[index] = false;
                  this.saveFavoriteQuotesToLocalStorage();
                  this.updateHeartIcon(quoteId);
                })
                .catch((error) => {
                  console.error('Error removing quote from favorites:', error);
                });
            }
          });
          this.getUserFavoriteQuotes(); // Refresh favorite quotes list
          this.loadFavoriteQuotesFromLocalStorage();

        });
      })
      .catch((error) => {
        console.error('Error querying Firestore:', error);
      });
  }

  getUserFavoriteQuotes() {
    this.favoriteQuotes = [];
    this.user$.subscribe((user) => {
      if (user) {
        const userId = user.uid;
        const userRef = this.firestore.collection('Users').doc(userId);

        userRef.get().then((doc) => {
          if (doc.exists) {
            const favorites = doc.data()?.['favorites'] || [];
            favorites.forEach((quoteId: string) => {
              this.firestore.collection('FunFacts').doc(quoteId).get().then((quoteDoc) => {
                if (quoteDoc.exists) {
                  const quote = quoteDoc.data();
                  if (quote) {
                    quote['quoteId'] = quoteId;
                    this.favoriteQuotes.push(quote);
                  }
                }
              });
            });
          }
        });
      }
    });
  }

  // UID: string = '';
  // async getUId() {
  //   const auth = getAuth();
  //   onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       let uid = user.uid;
  //       console.log('User ID:', uid);
  //       this.UID = uid;
  //     } else {
  //       console.log('User signed out.');
  //     }
  //   });
  // }

  async getUserActivities(uid: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.activityService.getUserActivities(uid).subscribe(
        (data: any[]) => {
          this.activities = data.sort((a, b) => b.date.toDate().getTime() - a.date.toDate().getTime());
          console.log(this.activities);
          resolve(this.activities);
        },
        error => {
          console.error('Error fetching user activities:', error);
          reject(error);
        }
      );
    });
  }

  async getFunFacts() {
    try {
      await this.getLoggedUserId();
      await this.getUserActivities(this.UID);
      // await this.getUserActivities(this.UID);

      // // this.saveAIQuote(this.openAiService.generateFunFacts(this.UID,this.activities));
      // this.openAiService.generateFunFacts(this.UID, this.activities).subscribe(response => {
      //   this.saveAIQuote(response);
      //   console.log('Generated fun facts:', this.aiquotes);
      // });
      const observablePromise: Promise<Observable<string>> = this.openAiService.generateFunFacts(this.UID, this.activities);
      const observable: Observable<string> = await observablePromise;

      // Subscribe to the observable to get the response
      observable.subscribe({
        next: response => {
          this.saveAIQuote(response);
          console.log('Generated fun facts:', this.aiquotes);
        },
        error: err => {
          console.error('Error generating fun facts:', err);
        }
      });
    } catch (error) {
      console.error('Error fetching user activities or generating fun facts:', error);
    }
    
  }
}
