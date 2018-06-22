import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ParallaxScrollModule } from 'ng2-parallaxscroll';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  LoginBtnClick(){
    //alert("Login Clicked");
    //this.router.navigate(['/admin/dashboard1']);
    this.router.navigateByUrl('/admin');
  }
}
