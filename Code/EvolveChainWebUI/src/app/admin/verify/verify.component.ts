import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response } from '@angular/http';

import { VerifyService } from '../verify/verify.service';
import { KYCData } from '../../model/kycdocument';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css'],
  providers : [VerifyService]
})
export class VerifyComponent implements OnInit {

  constructor(private router: Router, private verifyService: VerifyService) { }
  kycData : KYCData;

     newvar : any;

  ngOnInit() {

    let appKey : string = "d7bda9b4aee7d8db28a43be41c08f14a";

    this.newvar = 50;

    this.verifyService.GetKYCVerificationInfo(appKey).subscribe(loginData => {
      
     //var test : KYCData ;
     this.kycData = loginData.kycData;

    //var abc = this.newvar;

     //test = this.kycData ;

     //var ekycId = this.kycData.eKycId;
     //var ap = this.kycData.app_key;

      if(loginData.success){
        //this.router.navigateByUrl('/admin');
      }
      //this.isLoginError = true;
      
    },
      (error) => {
        //this.statusMessage ='Problem with the service. Please try again after sometime';
        console.error(error);
      }
    );
  }



}


