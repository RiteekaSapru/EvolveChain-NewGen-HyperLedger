import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { HttpHeaders } from '@angular/common/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/Observable/throw';


@Injectable()
export class LoginService {

    private loginUrl = environment.api + 'web/login';

    constructor(private _http: Http, private router: Router) {

    }

    Login(email, password): Observable<any> {

        //let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        //let options = new RequestOptions({headers : headers});

        // const httpOptions = {
        //     headers: new HttpHeaders({
        //         'Content-Type': 'application/json',
        //         'Authorization': 'my-auth-token'
        //     })
        // };

        return this._http.post(this.loginUrl,
            { "email_id": email, "password": password }
        )
            .map((response: Response) => <any>response.json())
            .catch(this.handleError);
    }

    Logout() {
        localStorage.removeItem('userToken');
        this.router.navigate(['/home']);
    }

    private handleError(error: Response) {
        console.error(error);
        return Observable.throw(error);
    }

}