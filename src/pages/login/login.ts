import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,Loading, LoadingController, AlertController} from 'ionic-angular';

import { EmailValidator } from '../../validators/email';
import {FirebaseserviceProvider} from '../../providers/firebaseservice/firebaseservice';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  public loginUser: FormGroup;
  loading: Loading;
  

  constructor(public service: FirebaseserviceProvider,
    public alertCtrl: AlertController,public loadingCtrl: LoadingController,
    public navCtrl: NavController,public formBuilder: FormBuilder,
     public navParams: NavParams) {

    this.loginUser = formBuilder.group({
      email:  ['', Validators.compose([Validators.required, EmailValidator.isValid])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(7)])]

    });
  }
  
  Login(): void {
    if(this.loginUser.valid) {
      this.loading = this.loadingCtrl.create();
      this.loading.present();

      this.service.UserlogIn(this.loginUser.value.email, this.loginUser.value.password)
      .then((authData) => {
        this.loading.dismiss().then(() =>{
          this.navCtrl.setRoot('ProfilePage');
        });
      }, (error) => {
        this.loading.dismiss().then(() => {
          let alert = this.alertCtrl.create({
            title: 'Error',
            message: error.message,
            buttons: [
              {
              text: 'OK',
              role: 'cancle'
              }
            ]
          });
          alert.present();
        });
      });

    }
  }
  showBasicAlert(text, title){
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }


}
