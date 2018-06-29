import { Component, OnInit } from '@angular/core';
import {LoginService} from '../../services/login.service';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css'],
  providers : [LoginService]
})
export class AdminHeaderComponent implements OnInit {

  constructor(private loginService : LoginService) { }

  ngOnInit() {
  }

  SignOutClick(){
    this.loginService.Logout();
  }

}
