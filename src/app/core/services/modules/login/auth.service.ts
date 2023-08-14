import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { JwtToken } from 'src/app/core/interfaces/jwt-token';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})
export class AuthService {

	private apiUrl: string = `${environment.apiUrlLogin}/Login`;
	private jwtTokenKey = 'jwtToken';

	constructor(private http: HttpClient) { }

	getToken(): string | null {
		const storedToken = localStorage.getItem(this.jwtTokenKey);
		const expirationDate = localStorage.getItem('tokenExpiration');

		if (storedToken && expirationDate) {
			const now = new Date();
			const tokenExpiration = new Date(expirationDate);

			if (now < tokenExpiration) {
				return storedToken;
			} else {
				this.removeToken();
			}
		}

		return null;
	}

	saveToken(token: string, expirationDate: Date): void {
		localStorage.setItem(this.jwtTokenKey, token);
		localStorage.setItem('tokenExpiration', expirationDate.toString());
	}

	removeToken(): void {
		localStorage.removeItem(this.jwtTokenKey);
		localStorage.removeItem('tokenExpiration');
	}

	getTokenFromServerAndRetry(req: HttpRequest<any>): Observable<any> {

		const body = {
			userName: environment.userName,
			password: environment.password
		};
		return this.http.post<JwtToken>(`${this.apiUrl}/GetToken`, body).pipe(
			switchMap((tokenResponse) => {
				this.saveToken(tokenResponse.token, tokenResponse.expirationDate);
				return this.retryWithNewToken(req);
			}),
			catchError(err => {
				return throwError(err);
			})
		);
	}

	private retryWithNewToken(req: HttpRequest<any>): Observable<any> {
		const newToken = this.getToken();
		if (newToken) {
			req = req.clone({
				setHeaders: {
					Authorization: `Bearer ${newToken}`
				}
			});
			return this.http.request(req);
		} else {
			return throwError('Token no disponible');
		}
	}

}
