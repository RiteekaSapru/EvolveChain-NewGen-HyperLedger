import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
//import { Observable } from 'rxjs/Observable';
 
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router : Router){

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):  boolean {

      if (localStorage.getItem('userToken') != null)
      return true;

      //this.router.navigate(['/home']);
      // not logged in so redirect to login page with the return url and return false
      this.router.navigate(['/home'], { queryParams: { returnUrl: state.url }});
      return false;
  }
}