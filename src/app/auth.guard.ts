import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { KratosService } from './kratos.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    protected kratos: KratosService,
    protected router: Router,
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const subject = new Subject<boolean>();

    this.checkSession(subject, route);
    return subject.asObservable();
  }

  protected async checkSession(subject: Subject<boolean>, route: ActivatedRouteSnapshot): Promise<void> {
    const hasIdentity = await this.kratos.hasIdentity();
    
    if (!hasIdentity
      && (route.routeConfig?.path !== 'login' && route.routeConfig?.path !== 'registration')) {
      console.log('route to login');
      this.router.navigate(['/login']);
      subject.next(false);
      return;
    }

    if (hasIdentity
      && (route.routeConfig?.path === 'login'
        || route.routeConfig?.path === 'registration')) {
      this.router.navigate(['/dashboard']);
      subject.next(false);
      return;
    }

    subject.next(true);
  }
}
