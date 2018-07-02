import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response } from '@angular/http';

import { VerifyService } from '../verify/verify.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css'],
  providers : [VerifyService]
})
export class VerifyComponent implements OnInit {

  constructor(private router: Router, private verifyService: VerifyService) { }

  ngOnInit() {

    let appKey : string = "d7bda9b4aee7d8db28a43be41c08f14a";

    this.verifyService.GetKYCVerificationInfo(appKey).subscribe(loginData => {
      
      if(loginData.success){


        //this.router.navigateByUrl('/admin');
      }
      //this.isLoginError = true;
      
    },
      //(error : HttpErrorResponse) => {
      (error) => {
        //this.statusMessage ='Problem with the service. Please try again after sometime';
        //this.isLoginError = true;
        console.error(error);
      }
    );
  }

}


