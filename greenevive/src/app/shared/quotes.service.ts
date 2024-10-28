import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { Quote } from '../Models/quote';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat';
import 'firebase/firestore';
import { ref } from 'firebase/database';
import 'firebase/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class QuotesService {

  constructor(private firestore: AngularFirestore) {}

  getUsers(): Observable<any[]>{
    return this.firestore.collection<any>('Users', ref => ref.limit(40)).valueChanges();
  }

  searchUsersByUsername(): Observable<any[]> {
    return this.firestore.collection('Users', //ref =>
      //ref.where('username', '>=', searchQuery).where('username', '<=', searchQuery + '\uf8ff')
    ).valueChanges();
  }


  getQuotes(): Observable<any[]> {
    return this.firestore.collection('FunFacts').valueChanges();
  }
}
