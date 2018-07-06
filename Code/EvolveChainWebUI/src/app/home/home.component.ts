import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response } from '@angular/http';

import { ParallaxScrollModule } from 'ng2-parallaxscroll';

import { LoginService } from '../services/login.service';

import {FooterComponent} from './footer.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers : [LoginService]
})
export class HomeComponent implements OnInit {

  model = new LoginUser('', '');
  submitted = false;
  isLoginError = false;

  // onLoginSubmit() {
  //   this.submitted = true;
  //   this.router.navigateByUrl('/admin');
  // }

  constructor(private router: Router, private loginService: LoginService) { }

  ngOnInit() {

  }

  LoginBtnClick() {
    //alert("Login Clicked");
    //this.router.navigate(['/admin/dashboard1']);

    this.loginService.Login(this.model.email, this.model.password).subscribe(loginData => {
      
      if(loginData.success){

        localStorage.setItem('userToken',loginData.token);
        this.router.navigateByUrl('/admin');
      }
      this.isLoginError = true;
      
    },
      //(error : HttpErrorResponse) => {
      (error) => {
        //this.statusMessage ='Problem with the service. Please try again after sometime';
        // Notice here we are logging the error to the browser console
        this.isLoginError = true;
        console.error(error);
      }
    );

  }
}

export class LoginUser {

  constructor(
    public email: string,
    public password: string,
  ) { }

}
