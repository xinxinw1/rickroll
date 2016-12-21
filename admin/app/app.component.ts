import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'my-app',
  template: `
    <h1>Prank page creator</h1>
    <router-outlet></router-outlet>
  `
})
export class AppComponent  {
  name = 'Angular';
}
