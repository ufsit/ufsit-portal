import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './/app-routing.module';
import { ShowdownModule } from 'ngx-showdown';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AuthGuardService } from './auth-guard.service';
import { SessionService } from './session.service';
import { RestService } from './rest.service';
import { ProfileResolverService } from './profile-resolver.service';
import { HomeResolverService } from './home-resolver.service';
import { ExternalFileService } from './external-file.service';

import { AdminComponent } from './admin/admin.component';
import { SponsorsComponent } from './sponsors/sponsors.component';
import { EventsComponent } from './events/events.component';
import { AboutComponent } from './about/about.component';
import { EditProfileComponent } from './edit_profile/edit_profile.component';
import { WriteupsComponent } from './writeups/writeups.component';
import { CTFBoardComponent } from './ctf-board/ctf-board.component';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { FooterComponent } from './footer/footer.component';

import { Routes } from '@angular/router';
import { ActivatedRouteSnapshot } from '@angular/router/src/router_state';

import { TimeAgoPipe } from './time-ago.pipe';
import { LimitToPipe } from './limit-to.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    AdminComponent,
    SponsorsComponent,
    EventsComponent,
    AboutComponent,
    FooterComponent,
    TimeAgoPipe,
    LimitToPipe,
    EditProfileComponent,
    WriteupsComponent,
    CTFBoardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    ShowdownModule,
    RouterModule
  ],
  providers: [
    AuthGuardService,
    SessionService,
    RestService,
    HttpClientModule,
    ProfileResolverService,
    HomeResolverService,
    ExternalFileService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
