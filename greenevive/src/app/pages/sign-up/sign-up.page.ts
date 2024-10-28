import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  email: string = '';
  password: string = '';
  username: string = '';
  ver_password: string = '';
  passwordVisible: boolean = false;
  verPasswordVisible: boolean = false;

  constructor(private auth: AuthService, private toastController: ToastController) {}

  ngOnInit() {}

  isClassicEmailFormat(email: string): boolean {
    const atIndex = email.indexOf('@');
    const dotIndex = email.lastIndexOf('.');

    return atIndex > 0 && dotIndex > atIndex + 1 && dotIndex < email.length - 1;
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'top',
    });
    toast.present();
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleVerPasswordVisibility() {
    this.verPasswordVisible = !this.verPasswordVisible;
  }

  register() {
    if (this.username === '') {
      this.presentToast('Please enter the username!');
      return;
    }
    if (this.email === '') {
      this.presentToast('Please enter the email!');
      return;
    }
    if (!this.isClassicEmailFormat(this.email)) {
      this.presentToast('Please enter a valid email address in the format: email@example.com');
      return;
    }
    if (this.password === '') {
      this.presentToast('Please enter the password!');
      return;
    }
    if (this.password !== this.ver_password) {
      this.presentToast('Please enter the same password in both fields!');
      return;
    }

    const passwordCriteria = [
      {
        pattern: /^(?=.*[A-Z])/,
        message: 'Password must contain at least one uppercase letter.',
      },
      {
        pattern: /^(?=.*[@$!%*?&._-])/,
        message: 'Password must contain at least one special character such as @ $ ! % * ? & . _ - ',
      },
      {
        pattern: /^(?=.*\d)/,
        message: 'Password must contain at least one digit.',
      },
      {
        pattern: /^.{8,}$/,
        message: 'Password must be at least 8 characters long.',
      },
    ];

    for (const criteria of passwordCriteria) {
      if (!criteria.pattern.test(this.password)) {
        this.presentToast('Please enter a valid password. ' + criteria.message);
        return;
      }
    }

    this.auth.register(this.username, this.email, this.password);
    this.email = '';
    this.password = '';
    this.username = '';
    this.ver_password = '';
  }
}
