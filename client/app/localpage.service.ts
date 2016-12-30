import { Injectable } from '@angular/core';

@Injectable()
export class LocalPageService {
  pages = {}; // page name to token map
  
  constructor() {
    this.pages = JSON.parse(localStorage.getItem('pages'));
    console.log("local pages", this.pages);
  }
  
  save(): void {
    localStorage.setItem('pages', JSON.stringify(this.pages));
    console.log("saved pages", this.pages);
  }
  
  get(name: string): any {
    return this.pages[name];
  }
  
  set(name: string, val: any): any {
    this.pages[name] = val;
    this.save();
    return val;
  }
  
  clear(name: string): any {
    let val = this.pages[name];
    delete this.pages[name];
    this.save();
    return val;
  }
  
  isset(name: string): boolean {
    return this.pages[name] !== undefined;
  }
}
