import { Component, OnInit } from '@angular/core';
import { getAuth, onAuthStateChanged } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastController } from '@ionic/angular'; // Importă ToastController din Ionic
import { AuthService } from 'src/app/shared/auth.service';
import { FirebaseError } from '@firebase/util';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {

  email: string = '';
  password: string = '';
  passwordVisible: boolean | undefined;
  

  constructor(
    private auth: AuthService,
    public afAuth: AngularFireAuth,
    private toastController: ToastController // Injectează ToastController
  ) { }

  ngOnInit() {
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
  
  async login() {
    if (this.email === '') {
      this.presentToast('Please enter the email!');
      return;
    }
    if (this.password === '') {
      this.presentToast('Please enter the password!');
      return;
    }

    let errorMessage = await this.auth.login(this.email, this.password);
    if(errorMessage != null){
      this.presentToast(errorMessage);
    }
    
  }
  
  getErrorMessage(error: FirebaseError) {
    switch (error.code) {
      case 'auth/user-not-found':
        return 'User not found. Please register first!';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again!';
      default:
        return 'An error occurred. Please try again later.';
    }
  }
  

  SignInWithGoogle() {
    this.auth.signInWithGoogle();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000, // Durata în milisecunde pentru afișarea Toast-ului
      position: 'top' // Poziția pe ecran unde va fi afișat Toast-ul (bottom, middle, top)
    });
    toast.present();
  }

  getUID()
{
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    const uid = user.uid;
    console.log(uid);

    // ...
  } else {
    // User is signed out
    // ...
    console.log("signed out");
  }
});
}
  
  

  
 

  

}
