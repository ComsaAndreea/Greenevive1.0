import { Component } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  constructor(
    private authService: AuthService,
    private alertController: AlertController
  ) {}

  async logoutWithConfirmation() {
    const alert = await this.alertController.create({
      header: 'Confirm Logout',
      message: 'Are you sure you want to log out?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Logout',
          handler: () => {
            this.authService.logout();
          },
        },
      ],
      
    });

    await alert.present();
  }
}
