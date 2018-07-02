import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { HttpHeaders } from '@angular/common/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/Observable/throw';

import { KYCData } from '../../model/kycdocument';

@Injectable()
export class VerifyService {

  private verifyUrl = environment.api + 'web/GetKYCVerificationInfo';

  constructor(private _http: Http, private router: Router) { }

  GetKYCVerificationInfo(appKey): Observable<any> {

    return this._http.post(this.verifyUrl,
      { "appkey": appKey }
    )
      .map((response: Response) => <KYCData>response.json())
      .catch(this.handleError);
  }

  private handleError(error: Response) {
    console.error(error);
    return Observable.throw(error);
  }

}
