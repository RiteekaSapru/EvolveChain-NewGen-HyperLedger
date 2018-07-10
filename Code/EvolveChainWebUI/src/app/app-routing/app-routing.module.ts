import { AdminDashboard2Component } from './../admin/admin-dashboard2/admin-dashboard2.component';
import { AdminDashboard1Component } from './../admin/admin-dashboard1/admin-dashboard1.component';
import { StarterComponent } from './../starter/starter.component';
import { AdminComponent } from './../admin/admin.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import {AuthGuard} from '../auth/auth.guard'
import { TermsComponent } from '../home/terms/terms.component';

@NgModule({
  imports: [
    RouterModule.forRoot([
      // { path: '', redirectTo: 'home', pathMatch: 'full', canActivate:[AuthGuard] },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'terms', component: TermsComponent },
      { path: 'starter', component: StarterComponent, canActivate:[AuthGuard] },
      //{ path: 'admin', redirectTo: 'admin'}
      // otherwise redirect to home
      //{ path: '**', redirectTo: '' }
    ])
  ],
  declarations: [],
  exports: [ RouterModule]
})
export class AppRoutingModule { }
