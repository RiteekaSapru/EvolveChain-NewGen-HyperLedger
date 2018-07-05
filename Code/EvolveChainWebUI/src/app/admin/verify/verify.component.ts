import { ViewChild, Component, ElementRef, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http, Response } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { VerifyService } from '../verify/verify.service';
import { KYCData } from '../../model/kycdocument';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css'],
  providers: [VerifyService]
})
export class VerifyComponent implements OnInit {

  constructor(private router: Router,
    private verifyService: VerifyService,
    private activatedRoute: ActivatedRoute) { }

  kycData: KYCData;

  isError: Boolean = false;
  errorMsg: String = "Some error occured !!";
  appKey: String = "";
  //newvar: string;
  @ViewChild('err') errorCntrl: ElementRef;


  ngOnInit() {

    //let appKey: string = "4a9e5ddfc6ea5224c0e82fa74e8a2955";

    this.activatedRoute.params.subscribe(pa => {
      //console.log(pa);
      this.appKey = pa.appkey;
    })

    this.verifyService.GetKYCVerificationInfo(this.appKey).subscribe(verificationInfo => {

      if (verificationInfo.success) {
        this.kycData = verificationInfo.kycData;
      }
      else {
        this.showError(verificationInfo.error);
      }

    }, (error) => {
      console.error(error);
      this.showError(error);
    });
  }

  SubmitClick(isAccepted) {

    var kycData = this.kycData;

    if (kycData.is_verified) {
      this.showError("This application is already verified.");
      return;
    }

    if (!this.isValidate()) {

      let reasoncodes = kycData.reasonList.filter(x => x.state).map(y => y.code);

      let submitData = {
        is_accepted: isAccepted,
        reason_codes:reasoncodes || [],
        appKey: this.appKey,
        comment: kycData.verification_comment
      };
      //Call Service..
      this.verifyService.SubmitApplication(submitData).subscribe(submittedApp => {

        if (submittedApp.success) {
          //this.kycData = verificationInfo.kycData;
          alert("The application processed successfully.")
          window.location.reload();
        }
      }, (error) => {  this.showError(error); });

    }
  }

  showError(error) : void {
    this.errorMsg = error;
    this.isError = true;
    //this.errorCntrl.nativeElement.focus();
  }

  isValidate(): Boolean {

    if (this.kycData.verification_comment == "" || this.kycData.verification_comment == undefined
      || this.kycData.verification_comment == null) {
      this.showError("Please enter the comments to accept or reject the application.");
    }
    return this.isError;
  }

}


