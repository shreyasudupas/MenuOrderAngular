import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()

export class AuthInterceptor implements HttpInterceptor {

  constructor(private auth:AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    var token = this.auth.getToken();
    
    if(token){
      request = request.clone({ setHeaders:{Authorization:'Bearer '+ token }});
    }

    if (!request.headers.has('Content-Type')) {
        request = request.clone({ headers: request.headers.append('Content-Type', 'application/json') });
    }
   
    return next.handle(request);
  }
}