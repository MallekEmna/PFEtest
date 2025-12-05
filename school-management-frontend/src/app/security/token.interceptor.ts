import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

// Liste des URLs publiques à ne pas intercepter ni rediriger (anti-boucles)
const PUBLIC_URLS = [
  '/api/admin/login',
  '/api/admin/register'
];

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Anti-boucle: ne pas ajouter d'Authorization ni rediriger sur les endpoints publics
  if (PUBLIC_URLS.some(url => req.url.includes(url))) {
    return next(req);
  }

  const token = auth.getToken();
  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    tap({
      error: (err) => {
        // Rediriger uniquement si on n'est pas déjà sur /login
        if (err?.status === 401 && !router.url.startsWith('/login')) {
          auth.logout();
          router.navigate(['/login']);
        }
      }
    })
  );
};