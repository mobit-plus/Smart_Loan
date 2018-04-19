import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Loading, LoadingController, AlertController } from 'ionic-angular';

import {FormGroup, Validators, FormBuilder} from '@angular/forms';
import {FirebaseserviceProvider} from '../../providers/firebaseservice/firebaseservice';
import {EmailValidator} from '../../validators/email';

// import for Facebook Login
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import {ProfilePage} from '../profile/profile';
// import for Google Login
import {GooglePlus} from '@ionic-native/google-plus';
import {AngularFireModule} from 'angularfire2';
import {Platform} from 'ionic-angular';
import {Observable} from 'rxjs/Observable';
import { Cordova } from '@ionic-native/core';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
  //providers: [GooglePlus],
})
export class RegisterPage {
  public signUp: FormGroup;
  loading: Loading;
  displayName;
  user: Observable<firebase.User>;
  
  isLoggedIn:boolean = false;

  constructor(public loadingCtrl: LoadingController,public alertCtrl: AlertController,
    public navCtrl: NavController, public navParams: NavParams,private googlePlus: GooglePlus,
    public formbuilder:FormBuilder,public service: FirebaseserviceProvider,
  private afAuth: AngularFireAuth,private platform:Platform) {

    this.user = this.afAuth.authState;

      this.signUp = formbuilder.group({
        name:['', Validators.compose([Validators.required, Validators.minLength(1)])],
       // lastname:['', Validators.compose([Validators.required, Validators.minLength(1)])],
       // address:['', Validators.compose([Validators.required, Validators.minLength(5)])],
      //  number:['', Validators.compose([Validators.required, Validators.minLength(10)])],
        email:['', Validators.compose([Validators.required, EmailValidator.isValid])],
        password: ['', Validators.compose([Validators.required,Validators.minLength(7)])]
      });

      afAuth.authState.subscribe(user => {
        //console.log(user);
        if(!user) {
          this.displayName = null;
          return;
        }
        this.displayName = user.displayName;
        //console.log(this.displayName);
      });
  }

  signUpUser() {
    if (this.signUp.valid) {
      this.loading = this.loadingCtrl.create();
      this.loading.present();

    this.service.Signup(this.signUp.value.email,
        this.signUp.value.password,this.signUp.value.name)
      .then(() => {
        this.loading.dismiss().then(() => {
          
          this.navCtrl.setRoot('ProfilePage');
        });
      },(error) => {
        this.loading.dismiss().then(() => {
          let alert =  this.alertCtrl.create({
            title: 'Error',
            message: error.message,
            buttons: [
              {
                text: 'OK',
                role: 'Cancle'
              }
            ]
          });
          alert.present();
        });
      });
    }

  }

  signInWithFacebook() {
    this.afAuth.auth
      .signInWithPopup(new firebase.auth.FacebookAuthProvider())
      .then(res => {
        console.log(res);
        this.navCtrl.setRoot('ProfilePage');
      });
  }

  Login() {
    this.navCtrl.push('LoginPage');
  }

  // Vrify() {
  //   this.navCtrl.push('PhonePage');
  // }

  // LoginWithGoogle() {
  //   this.googlePlus.login({
  //     'webClientId': '8410864657-nacpjbgbs39jja6fs8vke5evhalnbjsr.apps.googleusercontent.com',
  //     'offline': true,
  //   }).then(res => {
  //     firebase.auth().signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken))
  //     .then(suc => {
  //       alert('Longin Successfully.!');
  //     }).catch(usuc => {
  //       alert('Longin Unsuccessfully.!');
  //     })
  //   })
    
  // }

  LoginWithGoogle() {
    if (this.platform.is('cordova')) {
      this.nativeGoogleLogin();
    } else {
      this.webGoogleLogin();
    }

  }
  async nativeGoogleLogin(): Promise<void> {
    try {
        const gplusUser = await this.googlePlus.login({
          'webClientId': '8410864657-nacpjbgbs39jja6fs8vke5evhalnbjsr.apps.googleusercontent.com',
          'offline':true,
          'scopes': 'profile email'

        })
        return await this.afAuth.auth.signInWithCredential(
          firebase.auth.GoogleAuthProvider.credential(gplusUser.idToken)
        )
    } catch(error) {
      console.log(error);
    }

  }
  async webGoogleLogin(): Promise<void> {
    try {
      const provider = new firebase.auth.GithubAuthProvider();
      const credential = await this.afAuth.auth.signInWithPopup(provider);
    } catch(error) {
      console.log(error);
    }
  }
}
