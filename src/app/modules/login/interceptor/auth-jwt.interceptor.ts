import { Injectable } from '@angular/core';
import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from 'src/app/core/services/modules/login/auth.service';
import { JwtToken } from 'src/app/core/interfaces/jwt-token';

@Injectable()
export class AuthJwtInterceptor implements HttpInterceptor {

	constructor(private authService: AuthService) { }

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		const token = this.authService.getToken();

		if (token) {
			req = req.clone({
				setHeaders: {
					Authorization: `Bearer ${token}`
				}
			});
		}

		return next.handle(req).pipe(
			catchError(error => {
				if (error.status === 401) {
					return this.authService.getTokenFromServerAndRetry(req);
				} else {
					return throwError(error);
				}
			})
		);
	}
}
