import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { PageService } from './page.service';

@Component({
  moduleId: module.id,
  selector: 'my-create',
  templateUrl: 'create.component.html',
})
export class CreateComponent {
  message: string;

  constructor(
    private router: Router,
    private pageService: PageService,
    private location: Location
  ) {}

  create(name: string, pretend: string, redirect: string): void {
    if (!name || !pretend || !redirect) {
      this.message = 'Some fields empty';
      return;
    }
    this.pageService.create(name, pretend, redirect)
      .then(mess => this.router.navigate(['/list']))
      .catch(err => this.message = `Fail! ${err.text()}`);
  }
  
  back(): void {
    this.location.back();
  }
}
