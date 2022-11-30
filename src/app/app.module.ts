import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ForbiddenComponent } from './common/components/forbidden/forbidden.component';
import { PageNotFoundComponent } from './common/components/pageNotFound/page-not-found.component';
import { SigninRedirectCallbackComponent } from './common/components/signInRedirect/signin-redirect.component';
import { SignoutRedirectComponent } from './common/components/signOutRedirect/sign-redirect-callback.component';
import { GraphQLModule } from './common/module/graphql.module';

import { PrimeNGModule } from './common/module/primeng.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GlobalErrorHandler } from './common/services/global-error.service';
import { AuthInterceptor } from './common/interceptor/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    SigninRedirectCallbackComponent,
    PageNotFoundComponent,
    SignoutRedirectComponent,
    ForbiddenComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    PrimeNGModule,
    GraphQLModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
  ],
  providers: [
    { provide: ErrorHandler,useClass:GlobalErrorHandler },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
