import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { Page } from './page';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class PageService {
  constructor(private http: Http) { }
  
  get(name: string): Promise<Page> {
    return this.http.get(`get/${name}`)
             .toPromise()
             .then(res => res.json() as Page)
             .catch(this.handleError);
  }
  
  getPages(): Promise<Page[]> {
    return this.http
      .get('getAll')
      .toPromise()
      .then(res => res.json() as Page[])
      .catch(this.handleError);
  }
  
  private headers = new Headers({'Content-Type': 'application/json'});

  create(name: string, pretend: string, redirect: string): Promise<string> {
    return this.http
      .post('create', JSON.stringify({
        name: name,
        pretend: pretend,
        redirect: redirect
      }), {headers: this.headers})
      .toPromise()
      .then(res => res.text())
      .catch(this.handleError);
  }
  
  update(origName: string, page: Page): Promise<string> {
    return this.http
      .post('update', JSON.stringify({
        origName: origName
        page: page
      }), {headers: this.headers})
      .toPromise()
      .then(res => res.text())
      .catch(this.handleError);
  }
  
  delete(name: string): Promise<string> {
    return this.http
      .post('delete', JSON.stringify({
        name: name
      }), {headers: this.headers})
      .toPromise()
      .then(res => res.text())
      .catch(this.handleError);
  }
  
  private handleError(error: any): Promise<void> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
  
  test(): any {
    return this.http.get('https://www.youtube.com/')
      .toPromise()
      .then(res => console.log(res))
      .catch(this.handleError);
  }
}
