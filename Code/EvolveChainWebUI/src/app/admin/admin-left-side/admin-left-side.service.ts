import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/Observable/throw';

@Injectable()
export class AdminLeftSideService {
  private basePath = environment.api;

  constructor(private _http: Http, private router: Router) { }

  GetAppByPhone(phone): Observable<any> {
    let url = this.basePath + '/web/getAppDetailsByPhone/' + phone;

    return this._http.get(url)
      .map((response: Response) => <any>response.json())
      .catch(this.handleError);
  }

  private handleError(error: Response) {
    console.error(error);
    return Observable.throw(error);
  }

}
