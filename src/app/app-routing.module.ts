import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForbiddenComponent } from './common/components/forbidden/forbidden.component';
import { PageNotFoundComponent } from './common/components/pageNotFound/page-not-found.component';
import { SigninRedirectCallbackComponent } from './common/components/signInRedirect/signin-redirect.component';
import { SignoutRedirectComponent } from './common/components/signOutRedirect/sign-redirect-callback.component';

const routes: Routes = [
  //{ path:'user',loadChildren:()=> import('./UserComponent/user.module').then(m=>m.UserModule) },
  { path:'admin',loadChildren:()=> import('./admin/modules/admin.module').then(m=>m.AdminModule) },
  { path:'vendor',loadChildren:() => import('./vendor/modules/vendor.module').then(m=>m.VendorModule) },
  { path:'user',loadChildren:() => import('./user/modules/user.module').then(m=>m.UserModule) },
  { path: 'signin-callback', component: SigninRedirectCallbackComponent },
  { path: 'signout-callback', component: SignoutRedirectComponent },
  { path: '404', component: PageNotFoundComponent },
  { path: 'forbidden', component: ForbiddenComponent },
  { path: '*', redirectTo: '/404', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
