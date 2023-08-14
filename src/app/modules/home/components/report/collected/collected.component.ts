import { Component, OnInit } from '@angular/core';
import { Collected } from 'src/app/core/interfaces/collected';
import { ReportService } from 'src/app/core/services/modules/home/report.service';

@Component({
	selector: 'app-collected',
	templateUrl: './collected.component.html',
	styleUrls: ['./collected.component.css']
})
export class CollectedComponent implements OnInit {

	collectedData: Collected[] = [];
	filters: any = {
		id: '',
		station: '',
		way: '',
		hour: '',
		category: '',
		amount: '',
		tabulatedValue: '',
		date: ''
	};
	loading: boolean = false;
	showData: boolean = true;
	loadingSyncData: boolean = false;

	constructor(private reportService: ReportService) { }

	ngOnInit() {
		this.getCollectedData();
	}

	getCollectedData() {
		this.loading = true;
		this.showData = true
		this.reportService.getCollectedData().subscribe(
			(data: Collected[]) => {
				this.loading = false;
				this.collectedData = data;
				this.showData = this.collectedData.length > 0;
			},
			error => {
				this.loading = false;
				console.error('Error fetching collected data:', error);
			}
		);
	}

	get filteredData() {
		return this.collectedData.filter((item: any) => {
			return Object.keys(this.filters).every(key => {
				if (this.filters[key] === '') {
					return true;
				}
				return String(item[key]).toLowerCase().includes(this.filters[key].toLowerCase());
			});
		});
	}

	downloadPdf() {
		this.loading = true;
		this.reportService.getPdfData().subscribe(
			(pdfData: string) => {
				this.loading = false;
				this.downloadBase64Pdf(pdfData);
			},
			(error) => {
				this.loading = false;
				console.error('Error al obtener el PDF: ', error);
			}
		);
	}

	private downloadBase64Pdf(pdfData: string) {
		const blob = this.base64ToBlob(pdfData, 'application/pdf');
		const url = URL.createObjectURL(blob);

		const a = document.createElement('a');
		a.href = url;
		const currentDate = new Date();
		a.download = `Reporte_consolidado_recogida_${currentDate.getFullYear()}${(currentDate.getMonth() + 1).toString().padStart(2, '0')}${currentDate.getDate().toString().padStart(2, '0')}_${currentDate.getHours().toString().padStart(2, '0')}${currentDate.getMinutes().toString().padStart(2, '0')}${currentDate.getSeconds().toString().padStart(2, '0')}.pdf`;
		a.click();

		URL.revokeObjectURL(url);
	}

	private base64ToBlob(base64: string, contentType: string): Blob {
		const byteCharacters = atob(base64);
		const byteArrays = [];

		for (let offset = 0; offset < byteCharacters.length; offset += 512) {
			const slice = byteCharacters.slice(offset, offset + 512);

			const byteNumbers = new Array(slice.length);
			for (let i = 0; i < slice.length; i++) {
				byteNumbers[i] = slice.charCodeAt(i);
			}

			const byteArray = new Uint8Array(byteNumbers);
			byteArrays.push(byteArray);
		}

		return new Blob(byteArrays, { type: contentType });
	}

	SyncData(){
		this.loadingSyncData = true;
		this.reportService.getSync().subscribe(
			(res: any) => {
				if(res.msg == 'ok'){
					this.loadingSyncData = false;
					this.getCollectedData();
				} else {
					this.loadingSyncData = false;
					console.error('Error al sincronizar data');
				}
			},
			error => {
				this.loadingSyncData = false;
				console.error('Error al sincronizar data: ', error);
			}
		)
	}

}
