import { Component } from '@angular/core';
import { PageService } from './page.service';

@Component({
  moduleId: module.id,
  selector: 'my-create',
  templateUrl: 'create.component.html',
})
export class CreateComponent {
  message: string;
  
  constructor(
    private pageService: PageService
  ) {}
  
  create(name: string, pretend: string, redirect: string): void {
    if (!name || !pretend || !redirect){
      this.message = "Some fields empty";
      return;
    }
    this.pageService.create(name, pretend, redirect).then(() => this.message = "Success!").catch((m) => this.message = `Fail! ${m}`);
  }
}
