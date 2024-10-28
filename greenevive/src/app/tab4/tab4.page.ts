import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { ToastController } from '@ionic/angular';
import { Subject } from 'rxjs';



@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss']
})
export class Tab4Page implements OnInit {
  userData: any; // Definim o variabilă pentru a stoca datele utilizatorului
  userProfileImageUrl: any = null; // Variabilă pentru URL-ul imaginii de profil
  file: File | any = null; // Adăugăm variabila pentru a stoca fișierul selectat
  alertController: any;
 
  constructor(private authService: AuthService, private toastController: ToastController) {this.loadUserProfile();}

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.authService.getAuthUserData().subscribe((user) => {
      if (user) {
        this.authService.getUserProfileData(user.uid).subscribe((profileData: any) => {
          this.userData = profileData;
          this.getUserProfileImage(user.uid) // Apelăm metoda pentru a obține URL-ul imaginii de profil
        });
      }
    });
  }

  // Metoda pentru a obține URL-ul imaginii de profil din baza de date și a afișa poza de profil
  getUserProfileImage(userId: string) {
    if(this.authService.getUserProfileImageURL(userId)){
      this.authService.getUserProfileImageURL(userId).subscribe((url: string | null) => {
        if (url) {
          this.userProfileImageUrl = url;
        }
      });
    }
  }
  
  onFileSelected(event: any) {
    this.file = event.target.files[0]; // Salvăm fișierul selectat în variabila 'file'
  }

  // Metoda pentru încărcarea și salvarea imaginii în Firebase Storage
  uploadImage() {
    //Actualizam datele userului
    this.updateUserProfile();


    if (!this.file || !(this.file instanceof File)) {
      // If file is null or not an instance of File, do nothing
      return;
    }
    this.authService.getAuthUserData().subscribe((user) => {
      if (user) {
        this.authService.uploadUserProfileImage(user.uid, this.file).then((url) => {
          if (url) {
            // Update the user profile image URL in Firebase
            this.authService.updateUserProfileImage(user.uid, url);
            this.presentToast("Image successfully updated!");
            this.loadUserProfile(); // Reload user profile data after the image and user data have been updated
          } else {
            console.error('Error uploading image. URL is null.');
          }
        });
      }
    });
    

  }
  
  updateUserProfile() {
    if(this.userData!=undefined){
      // if (!this.isPhoneNumberValid(this.userData.telefon)) {
      //   this.presentToast('The phone number must consist of digits and the + sign only.');
      //   return;
      // }
        // Call the method from the AuthService to update the profile in Firebase
        this.presentToast("User data successfully updated!");
        this.authService.updateUserProfile(this.userData);
    }
    return;
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }

  // private isPhoneNumberValid(phoneNumber: string): boolean {
  //   if(phoneNumber==null || phoneNumber==""){
  //     return true;
  //   }
  //   // Regular expression for phone number validation
  //   const phoneNumberRegex = /^[0-9+]+$/;
  //   return phoneNumberRegex.test(phoneNumber);
  // }

  // async showPhoneNumberRulesPopup() {
  //   const alert = await this.alertController.create({
  //     header: 'Phone Number Rules',
  //     message: 'The phone number must consist of digits and the + sign only.',
  //     buttons: ['OK']
  //   });
  // }

  onInput(event: any) {
    const input = event.target.value;
    if (!/^\+?\d+$/.test(input)) {
      this.presentToast('The phone number must consist of digits and the + sign only.');
    }
    // Remove non-digit characters from input using regular expression
    const digitsOnly = input.replace(/[^\d+]/g, '');
    // Update the input field value with digits-only value
    event.target.value = digitsOnly;
  }

  private unsubscribe$ = new Subject<void>();

  ngOnDestroy() {
    // Unsubscribe from observables to prevent memory leaks
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}