// auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { Observable, of } from 'rxjs';
import { catchError, finalize, switchMap } from 'rxjs/operators';
import { error } from 'console';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
 
  constructor(
    private fireauth: AngularFireAuth,
    private router: Router,
    private firestore: AngularFirestore,
    private storage: AngularFireStorage
  ) {}

  async login(email: string, password: string) : Promise<string | null>{
    try{
      await this.fireauth
      .signInWithEmailAndPassword(email, password);
      
        localStorage.setItem('token', 'true');
        this.router.navigate(['/tabs']);
        return null;
    }catch(err: any) {
        let errorMessage: string = '';

        switch (err.code) {
          case 'auth/invalid-email':
            errorMessage = 'Invalid email address format. Please enter a valid email.';
            break;
          case 'auth/user-disabled':
            errorMessage = 'This user account has been disabled. Please contact support.';
            break;
          case 'auth/user-not-found':
            errorMessage = 'No user found with this email. Please sign up first.';
            break;
          case 'auth/wrong-password':
            errorMessage = 'Incorrect password. Please try again.';
            break;
          case 'auth/invalid-login-credentials':
            errorMessage = 'Invalid login credentials.';
            break;
          default:
            errorMessage = 'Error signing in: ' + err.code;
            break;
        }

        return errorMessage;
      }
      

  }

  logout() {
    this.fireauth
      .signOut()
      .then(() => {
        // După ce utilizatorul se deconectează, ștergem token-ul din localStorage
        localStorage.removeItem('token');
        // Redirecționăm utilizatorul către pagina de autentificare (pagina de sign-in)
        this.router.navigate(['/sign-in']);
      })
      .catch((err) => {
        alert('Something went wrong during logout!');
        console.error(err);
      });
  }

  signInWithGoogle() {
    return this.fireauth
      .signInWithPopup(new GoogleAuthProvider())
      .then((credential) => {
        // Check if user is new or existing
        if (credential.additionalUserInfo?.isNewUser) {
          const currentUser = credential.user;
          if(currentUser){
          const userId = currentUser.uid;
          //Salvare în colecția "Users" din Firestore
          this.firestore
            .collection('Users')
            .doc(userId)
            .set({
              username: "",
              email: credential.user?.email,
              password: "",
            }).then(() => {
              console.log('New user document created in Firestore');
            })
            .catch((error) => {
              console.error('Error creating user document in Firestore:', error);
            });
          }
        }
        localStorage.setItem('token', 'true');
        this.router.navigate(['/tabs']);
      })
      .catch((err) => {
        alert('Something went wrong! '+err.message);
        this.router.navigate(['/sign-in']);
      });
  }

  register(username: string, email: string, password: string) {
    this.fireauth
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const currentUser = userCredential.user;
        if (currentUser) {
          const userId = currentUser.uid;

          //Salvare în colecția "Users" din Firestore
          this.firestore
            .collection('Users')
            .doc(userId)
            .set({
              username: username,
              email: email,
              password: password,
            })
            .then(() => {
              localStorage.setItem('token', 'true');
              this.router.navigate(['/tabs']);
            })
            .catch((error) => {
              alert('Something went wrong! '+ error.message);
              this.router.navigate(['/sign-up']);
            });
        }
      })
      .catch((error) => {
        alert('Something went wrong! '+error.message);
        this.router.navigate(['/sign-up']);
      });
  }

  forgotPassword(email: string) {
    this.fireauth
      .sendPasswordResetEmail(email)
      .then(() => {
        this.router.navigate(['/sign-in']);
      })
      .catch((err) => {
        alert('Something went wrong');
      });
  }

  getAuthUserData() {
    return this.fireauth.user;
  }

  getCurrentUser() {
    console.log('Am intrat si in getCurrentUser din auth service');
    return this.fireauth.authState;
    
  }

  getUserProfileData(uid: string) {
    return this.firestore.collection('Users').doc(uid).valueChanges();
  }

  updateUserProfile(userDetails: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.fireauth.authState.subscribe((user) => {
        if (user) {
          
          this.firestore.collection('Users').doc(user.uid).update(userDetails)
            .then(() => {
              resolve(); 
            })
            .catch((error) => {
              reject(error); 
            });
        } else {
          reject(new Error('Utilizatorul nu este autentificat.')); 
        }
      });
    });
  }


  async uploadUserProfileImage(userId: string, image: File): Promise<string> {
    const filePath = `user-profiles/${userId}/profile.jpg`;
    const fileRef = this.storage.ref(filePath);

    const uploadTask: AngularFireUploadTask = this.storage.upload(filePath, image);

    try {
      await uploadTask;
      const url = await fileRef.getDownloadURL().toPromise();
      return url;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  getUserProfileImageURL(userId: string): Observable<string | null> {
    try {
      const fileRef = this.storage.ref(`user-profiles/${userId}/profile.jpg`)
      return fileRef.getMetadata().pipe(
        switchMap(metadata => {
          // If metadata exists, the file exists, so return its download URL
          return fileRef.getDownloadURL() as Observable<string | null>;
        }),
        catchError(error => {
          // If the file does not exist or there's an error, return null
          //console.error('Error fetching file metadata:', error);
          return of(null);
        })
    );}
    catch(error){
      return of(null);
    }
  }

  async updateUserProfileImage(userId: string, imageURL: string): Promise<void> {
    try {
      await this.firestore.collection('Users').doc(userId).update({
        profileImageURL: imageURL
      });
    } catch (error) {
      console.error('Error updating profile image URL:', error);
      throw error;
    }
  }


  
  

}