import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private http: HttpClient) { }

  classifyUrl = "http://127.0.0.1:5000/classify";

  classifyImage(image: number[]) {
    return this.http.put(this.classifyUrl, {'data' : JSON.stringify(image)});
  }
}
