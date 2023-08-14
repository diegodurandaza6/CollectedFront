import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Collected } from 'src/app/core/interfaces/collected';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})
export class ReportService {

	private apiUrl: string = `${environment.apiUrlCollected}/Collected`;
	private apiUrlNoGateway: string = `${environment.apiUrlCollectedNoGateway}/Collected`;

	constructor(private http: HttpClient) { }

	getCollectedData(): Observable<Collected[]> {
		return this.http.get<Collected[]>(`${this.apiUrl}/GetCollected`);
	}

	getPdfData(): Observable<string> {
		return this.http.get<string>(`${this.apiUrl}/GetReport`);
	}

	getSync(): Observable<string> {
		return this.http.get<string>(`${this.apiUrlNoGateway}/CreateCollected`);
	}
}
