import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SponsorsComponent } from './sponsors/sponsors.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { EditProfileComponent } from './edit_profile/edit_profile.component';

import { AuthGuardService } from './auth-guard.service';
import { ProfileResolverService } from './profile-resolver.service';
import { HomeResolverService } from './home-resolver.service';
import { AdminComponent } from './admin/admin.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    canActivate: [AuthGuardService],
    component: HomeComponent,
    resolve: {
      profile: HomeResolverService
    }
  },
  {
    path: "admin",
    component: AdminComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: "edit_profile",
    component: EditProfileComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'sponsors',
    component: SponsorsComponent
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'login',
    canActivate: [AuthGuardService],
    component: LoginComponent
  },
  {
    path: 'register',
    canActivate: [AuthGuardService],
    component: RegisterComponent
  },
  {
    path: 'profile',
    canActivate: [AuthGuardService],
    component: ProfileComponent,
    resolve: {
      profile: ProfileResolverService
    }
  },
  {
    path: 'profile/:id',
    canActivate: [AuthGuardService],
    component: ProfileComponent,
    resolve: {
      profile: ProfileResolverService
    }
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
