import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageService } from './page.service';
import { MessageService } from './message.service';

import { Page } from './page';

@Component({
  selector: 'my-list',
  templateUrl: './list.component.html',
})
export class ListComponent implements OnInit {
  pages: Page[];
  origName: string;
  selectedPage: Page;
  messageList: string;
  messageEdit: string;

  constructor(
    private router: Router,
    private pageService: PageService,
    private messageService: MessageService
  ) {}
  
  ngOnInit(): void {
    this.getPages();
    if (this.messageService.isset('message')){
      this.messageList = this.messageService.get('message');
      this.messageService.clear('message');
    }
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
  
  clearMessages(): void {
    this.messageList = undefined;
    this.messageEdit = undefined;
  }
  
  save(): void {
    this.pageService.update(this.origName, this.selectedPage)
      .then(mess => {
        this.origName = this.selectedPage.name;
        this.clearMessages();
        this.messageEdit = mess;
      })
      .catch(err => {
        this.clearMessages();
        this.messageEdit = `Fail! ${err}`;
      });
  }
  
  delete(page: Page): void {
    this.pageService.delete(page.name)
      .then(mess => {
        if (this.origName == page.name){
          this.origName = undefined;
          this.selectedPage = undefined;
        }
        this.clearMessages();
        this.messageList = mess;
        this.getPages();
      })
      .catch(err => {
        this.clearMessages()
        this.messageList = `Fail! ${err}`;
      });
  }
  
  goToCreate(): void {
    this.router.navigate(['/create']);
  }
}
