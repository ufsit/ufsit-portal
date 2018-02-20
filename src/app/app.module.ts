import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot } from '@angular/router/src/router_state';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { ShowdownModule } from 'ngx-showdown';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { FooterComponent } from './footer/footer.component';

import { AppRoutingModule } from './/app-routing.module';

import { AuthGuardService } from './auth-guard.service';
import { SessionService } from './session.service';
import { RestService } from './rest.service';
import { ProfileResolverService } from './profile-resolver.service';
import { AdminComponent } from './admin/admin.component';
import { SponsorsComponent } from './sponsors/sponsors.component';
import { AboutComponent } from './about/about.component';
import { HomeResolverService } from './home-resolver.service';
import { TimeAgoPipe } from './time-ago.pipe';
import { EditProfileComponent } from './edit_profile/edit_profile.component';
import { WriteupsComponent } from './writeups/writeups.component';
import { ExternalFileService } from './external-file.service';


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
    AboutComponent,
    FooterComponent,
    TimeAgoPipe,
    EditProfileComponent,
    WriteupsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    ShowdownModule
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
