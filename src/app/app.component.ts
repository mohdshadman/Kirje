import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { AlertController } from 'ionic-angular';
import { Http , Headers, RequestOptions} from '@angular/http';
import { IBeacon } from '@ionic-native/ibeacon';


import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { AboutPage } from '../pages/about/about'

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
              private push: Push, public alertCtrl: AlertController, public http: Http,
              private ibeacon: IBeacon) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      // { title: 'List', component: ListPage }
      { title: 'About', component: AboutPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.pushSetup();
      this.beaconMonitoring();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
  pushSetup(){
    const options: PushOptions = {
      android: {
        senderID: '540743657036'
      },
      ios: {
          alert: 'true',
          badge: true,
          sound: 'false'
      }
   }
   
   const pushObject: PushObject = this.push.init(options);
   
   
   pushObject.on('notification').subscribe((notification: any) => {
     console.log('Received a notification', notification);
     this.showAlert(notification.title, notification.message);
    });
   
   pushObject.on('registration').subscribe((registration: any) => {
   //this.dopost(101);
   console.log('Device registered', registration);
   });
   
   pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
   
  }
  showAlert(title: any, message: string) {
    var titleValue: string;
    if (title == undefined){
      titleValue = '';
    }
    else {
      titleValue = title;
    }  
    const alert = this.alertCtrl.create({
      title: titleValue,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }
  dopost(id: any){
    let url = "http://103.241.181.83:8000/api/deviceid.php?key=apnatimeaayega";
    //let url ="http://jsonplaceholder.typicode.com/posts";
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin' , '*');
    headers.append('Access-Control-Allow-Methods', '*');
    //headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json' );
    //let data =  new FormData();
     //data.append('device_id', id );
     let data = {
       'device_id': id
      };
      let options = new RequestOptions({ headers:headers, withCredentials: true});

       //this.http.post(url,data, ).subscribe(data => console.log(data));
      console.log(data);
       this.http.post(url, data, options)
      .subscribe(data => {
        console.log("success");
        console.log(data['_body']);
       }, error => {
        console.log(error);// Error getting the data
      });
    
  }

  beaconMonitoring() { 
 // Request permission to use location on iOS
this.ibeacon.requestAlwaysAuthorization();
// create a new delegate and register it with the native layer
let delegate = this.ibeacon.Delegate();

// Subscribe to some of the delegate's event handlers
delegate.didRangeBeaconsInRegion()
  .subscribe(
    data => console.log('didRangeBeaconsInRegion: ', data),
    error => console.error()
  );
delegate.didStartMonitoringForRegion()
  .subscribe(
    data => console.log('didStartMonitoringForRegion: ', data),
    error => console.error()
  );
delegate.didEnterRegion()
  .subscribe(
    data => {
      console.log('didEnterRegion: ', data);
      this.showAlert('NOTIFICATION', 'YOU ARE IN.....');
    }
  );
  delegate.didExitRegion()
  .subscribe(
    data => {
      console.log('didEXITerRegion: ', data);
      this.showAlert('NOTIFICATION', 'YOU ARE OUT.....');
    }
  );

let beaconRegion = this.ibeacon.BeaconRegion('TCZ','23A01AF0-232A-4518-9C0E-323FB773F5EF');

this.ibeacon.startMonitoringForRegion(beaconRegion)
  .then(
    () => console.log('Native layer received the request to monitoring'),
    error => console.error('Native layer failed to begin monitoring: ', error)
  );

}
}
 