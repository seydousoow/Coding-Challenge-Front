import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {RegistrationComponent} from './registration/registration.component';
import {PreferredShopsComponent} from './preferred-shops/preferred-shops.component';
import {NearbyShopsComponent} from './nearby-shops/nearby-shops.component';
import {GuardGuard} from './guards/guard.guard';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegistrationComponent
  }, {
    path: 'nearBy',
    component: NearbyShopsComponent,
    canActivate: [GuardGuard]
  },
  {
    path: 'preferred',
    component: PreferredShopsComponent,
    canActivate: [GuardGuard]
  },
  {
    path: '',
    redirectTo: 'nearBy',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
