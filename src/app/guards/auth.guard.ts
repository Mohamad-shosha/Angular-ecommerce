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
    route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    console.log('🚀 AuthGuard activated for route:', route.routeConfig?.path);

    const accessToken = localStorage.getItem('accessToken');
    console.log('Access Token:', accessToken);

    if (accessToken) {
      try {
        const payload = JSON.parse(atob(accessToken.split('.')[1]));
        const roles: string[] =
          payload.roles || (payload.role ? [payload.role] : []);

        console.log('🔐 Decoded Payload:', payload);
        console.log('👤 User roles:', roles);

        const allowedRoles = route.data['roles'] as string[];
        console.log('✅ Allowed roles for this route:', allowedRoles);

        if (!allowedRoles || allowedRoles.length === 0) {
          return true;
        }

        if (roles.some((role) => allowedRoles.includes(role))) {
          return true;
        }
      } catch (e) {
        console.error('❌ Invalid token payload', e);
      }
    }

    // ⛔ Unauthorized - redirect to login
    return this.router.createUrlTree(['/auth/login']);
  }
}
