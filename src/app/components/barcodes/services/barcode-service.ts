import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface BarcodeDto {
  id: number;
  code: string;
  deletedAt?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class BarcodeService {

  private apiUrl = 'http://localhost:5169/api/barcodes';

  constructor(private http: HttpClient) { }

  getAll(): Observable<BarcodeDto[]> {
    return this.http.get<BarcodeDto[]>(this.apiUrl);
  }

  create(code: string): Observable<any> {
    
    return this.http.post(this.apiUrl, { code: code });
  }

  softDelete(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/soft-delete`, {});
  }
}
