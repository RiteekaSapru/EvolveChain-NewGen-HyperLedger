import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response } from '@angular/http';
import {FormsModule} from '@angular/forms';

import { VerifyService } from '../verify/verify.service';
import { KYCData } from '../../model/kycdocument';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css'],
  providers: [VerifyService]
})
export class VerifyComponent implements OnInit {

  constructor(private router: Router, private verifyService: VerifyService) { }
  kycData: KYCData;

  newvar: string;

  ngOnInit() {

    let appKey: string = "4a9e5ddfc6ea5224c0e82fa74e8a2955";

    this.newvar = "6767";

    this.verifyService.GetKYCVerificationInfo(appKey).subscribe(loginData => {

      //var test : KYCData ;
      this.kycData = loginData.kycData;

      //var abc = this.newvar;

      //test = this.kycData ;

      //var ekycId = this.kycData.eKycId;
      //var ap = this.kycData.app_key;

      if (loginData.success) {
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

  SubmitClick(isApproved){

    let fg = isApproved;

    var kycData = this.kycData;

  }

}


