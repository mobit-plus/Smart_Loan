import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import {FirebaseserviceProvider} from '../../providers/firebaseservice/firebaseservice';
@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  // name: string;
  // lastname: string;
  // address: string;
  // number: number;
  // email: any;

  constructor(public service: FirebaseserviceProvider,public navCtrl: NavController, public navParams: NavParams) {
   
  }

  userData(){
    console.log(this.navParams.get("email"));
  }
  
  logOut() {
    this.service.UserlogOut().then(() => {
      this.navCtrl.setRoot('RegisterPage');
    });
  }

}
