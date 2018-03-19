import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SponsorsComponent } from './sponsors/sponsors.component';
import { EventsComponent } from './events/events.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { EditProfileComponent } from './edit_profile/edit_profile.component';

import { AuthGuardService } from './auth-guard.service';
import { ProfileResolverService } from './profile-resolver.service';
import { HomeResolverService } from './home-resolver.service';
import { AdminComponent } from './admin/admin.component';
import { WriteupsComponent } from './writeups/writeups.component';
import { WriteupViewComponent } from './writeup-view/writeup-view.component';

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
    path: 'admin',
    component: AdminComponent,
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
    path: 'events',
    component: EventsComponent
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
    path: 'profile/edit',
    component: EditProfileComponent,
    canActivate: [AuthGuardService],
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
  },
  {
    path: 'profile/:id/edit',
    component: EditProfileComponent,
    canActivate: [AuthGuardService],
    resolve: {
      profile: ProfileResolverService
    }
  },
  {
    path: 'writeups',
    canActivate: [AuthGuardService],
    component: WriteupsComponent
  },
  {
    path: 'writeups/:key',
    canActivate: [AuthGuardService],
    component: WriteupViewComponent
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
