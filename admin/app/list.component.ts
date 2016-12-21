import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageService } from './page.service';

import { Page } from './page';

@Component({
  moduleId: module.id,
  selector: 'my-list',
  templateUrl: 'list.component.html',
})
export class ListComponent implements OnInit {
  pages: Page[];
  origName: string;
  selectedPage: Page;
  message: string;

  constructor(
    private router: Router,
    private pageService: PageService
  ) {}
  
  ngOnInit(): void {
    this.getPages();
  }
  
  getPages(): void {
    this.pageService.getPages()
      .then(pages => {
        console.log("got pages");
        console.log(pages);
        this.pages = pages;
      });
  }
  
  onSelect(page: Page): void {
    this.selectedPage = page;
    this.origName = page.name;
  }
  
  save(): void {
    this.pageService.update(this.origName, this.selectedPage)
      .then(mess => {
        this.origName = this.selectedPage.name;
        this.message = mess;
      })
      .catch(err => this.message = `Fail! ${err}`);
  }
  
  delete(page: Page): void {
    this.pageService.delete(page.name)
      .then(mess => {
        if (this.origName == page.name){
          this.origName = undefined;
          this.selectedPage = undefined;
        }
        this.message = mess;
        this.getPages();
      })
      .catch(err => this.message = `Fail! ${err}`);
  }
  
  goToCreate(): void {
    this.router.navigate(['/create']);
  }
  
  test(): any {
    this.pageService.test();
  }
}
