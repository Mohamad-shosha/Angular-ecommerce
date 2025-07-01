import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      const userRole = payload.role;

      // ✅ تحقق من صلاحية الصفحة بناءً على الدور
      if (
        (state.url.startsWith('/admin') && userRole === 'ADMIN') ||
        (state.url.startsWith('/user') && userRole === 'USER')
      ) {
        return true;
      }
    }

    // ❌ تحويل لصفحة تسجيل الدخول لو مفيش صلاحية
    return this.router.createUrlTree(['/login']);
  }
}
