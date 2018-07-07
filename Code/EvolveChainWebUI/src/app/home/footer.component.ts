import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response } from '@angular/http';


@Component({
  selector: 'app-home-footer',
  //templateUrl: './home.component.html',
  template : `
  <footer class="evolvechain-footer">
  <div class="container">
      <div class="row">
          <div class="col-sm-6">
              <div class="copyright">
                  <span>Â© EvolveChain 2018</span>
              </div>
          </div>
          <div class="col-sm-6 text-right">
              <div class="app-icon">
                  <span>Download Our App: </span>
                  <a href="/assets/apks/EvolveChain.ipa">
                      <img src="assets/img/apple.png" alt="" target="_self" download/>
                  </a>
                  <a href="/assets/apks/EvolveChain.apk">
                      <img src="assets/img/android.png" alt="" target="_self" download/>
                  </a>
              </div>
          </div>

      </div>
  </div>
</footer>`,
  //styleUrls: ['./home.component.css'],

})
export class FooterComponent implements OnInit {

    constructor() { }

    ngOnInit() {
  
    }
}