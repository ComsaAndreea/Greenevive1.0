// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { initializeApp } from "@angular/fire/app";
import { getFirestore } from "@angular/fire/firestore";

 export const environment = {
  production: false,
  firebase: {
    databaseURL: 'https://greenevive-9c57f-default-rtdb.europe-west1.firebasedatabase.app',
    apiKey: "AIzaSyDnqusw72ziikMz6osvaTShX8DODO7HSSM",
    authDomain: "greenevive-9c57f.firebaseapp.com",
    projectId: "greenevive-9c57f",
    storageBucket: "greenevive-9c57f.appspot.com",
    messagingSenderId: "123307653759",
    appId: "1:123307653759:web:7548563ed2fcd309d41d4a"
  }

  

};





/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
