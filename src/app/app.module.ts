import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot } from '@angular/router/src/router_state';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';

import { AppRoutingModule } from './/app-routing.module';

import { AuthGuardService } from './auth-guard.service';
import { SessionService } from './session.service';
import { RestService } from './rest.service';
import { ProfileResolverService } from './profile-resolver.service';
import { AdminComponent } from './admin/admin.component';
import { SponsorsComponent } from './sponsors/sponsors.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    AdminComponent,
    SponsorsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule.forRoot()
  ],
  providers: [
    AuthGuardService,
    SessionService,
    RestService,
    HttpClientModule,
    ProfileResolverService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
