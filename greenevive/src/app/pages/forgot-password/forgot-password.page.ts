import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  email : string = '';

  constructor(private auth : AuthService) { }

  ngOnInit() {
  }

  forgotPassword() {
    this.auth.forgotPassword(this.email);
    this.email = '';
  }

}
