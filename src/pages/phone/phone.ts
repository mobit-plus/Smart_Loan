import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import * as firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-phone',
  templateUrl: 'phone.html',
})
export class PhonePage {
  verificationId: any;
  code: string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }


  LonginPhone() {
    (<any>window).AccountKitPlugin.loginWithPhoneNumber({
      useAccessToken: true,
      defaultCountryCode: "IN",
      facebookNotificationsEnabled: true,
    },(data) => {
      (<any>window).AccountKitPlugin.getAccount((info) => {
        this.navCtrl.setRoot('ProfilePage');
      });
    },(error) => {
      alert(error);
    })
  }

  // sendOTP() {
    
  //   (<any>window).FirebasePlugin.verifyPhoneNumber(9179074553, 60, (credential) => {
  //     alert("SMS sent Successfully");
  //     console.log(credential);

  //     this.verificationId = credential.verificationId;
  //   }, (error) => {
  //     console.log(error);
  //   })
  // }

  // varify(){
  //   let signCredential = firebase.auth.PhoneAuthProvider.credential(this.verificationId, this.code);
  //   firebase.auth().signInWithCredential(signCredential)
  //   .then((res) => {
  //     console.log(res);
  //   },(error) => {
  //     console.log(error);
  //   });
  // }

}
