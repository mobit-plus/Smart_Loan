import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase} from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import 'rxjs/add/operator/map';


@Injectable()
export class FirebaseserviceProvider {
  user: firebase.User;
  authState: Observable<firebase.User>;

  constructor(public http: HttpClient, private afAuth:AngularFireAuth, public afd: AngularFireDatabase) {
    
    this.authState = afAuth.authState;
    this.authState.subscribe(user => {
      this.user = user;
    });
  }

  Signup(email, password,name) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
    .then(newUser => {
      this.afd.list('/Userdata').update(newUser.uid, {email:email,name:name});
    });
  }

  UserlogIn(email, password){
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  UserlogOut(){
    return this.afAuth.auth.signOut();
  }

}
