import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';

import { AuthGuardService } from './auth-guard.service';
import { ProfileResolverService } from './profile-resolver.service';

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
      profile: ProfileResolverService
    }
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
    component: ProfileComponent
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
