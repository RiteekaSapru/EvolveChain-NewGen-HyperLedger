import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminLeftSideService } from '../admin-left-side/admin-left-side.service';

@Component({
  selector: 'app-admin-left-side',
  templateUrl: './admin-left-side.component.html',
  styleUrls: ['./admin-left-side.component.css'],
  providers: [AdminLeftSideService]
})

export class AdminLeftSideComponent implements OnInit {

  isSearchError = false;
  showSearchError = false;

  constructor(private router: Router, private _service: AdminLeftSideService) { }

  ngOnInit() {
  }

  SearchClick(phone) {
    let aa = phone;
    this._service.GetAppByPhone(phone).subscribe(appData => {

        if (appData && appData.key) {
          let path = '/admin/verify/' + appData.key;
          this.router.navigateByUrl(path);
        
      } else {
        this.isSearchError = true;
        this.showSearchError = true;
      }
    })
  }
}
