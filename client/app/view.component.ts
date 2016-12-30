import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { PageService } from './page.service';
import { LocalPageService } from './localpage.service';
import { MessageService } from './message.service';

import { Page } from './page';

import 'rxjs/add/operator/switchMap';

@Component({
  templateUrl: './view.component.html',
})
export class ViewComponent implements OnInit {
  page: Page;
  origName: string;
  message: string;
  token: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private pageService: PageService,
    private localPageService: LocalPageService,
    private messageService: MessageService
  ) {}
  
  ngOnInit(): void {
    this.route.params
      .subscribe(params => {
        this.pageService.get(params['tag'])
          .then(page => {
            this.page = page;
            this.origName = page.name;
            this.token = this.localPageService.get(page.name);
          })
          .catch(err => {
            this.message = err;
          });
      });
    this.message = this.messageService.collect('message');
  }
  
  save(): void {
    this.pageService.update(this.origName, this.page, this.token)
      .then(mess => {
        this.origName = this.page.name;
        this.message = mess;
      })
      .catch(err => {
        this.message = `Failed to save! ${err}`;
      });
  }
  
  delete(): void {
    this.pageService.delete(this.origName, this.token)
      .then(mess => {
        this.messageService.set('message', mess);
        this.router.navigate(['/create']);
      })
      .catch(err => {
        this.message = `Failed to delete! ${err}`;
      });
  }
  
  goToCreate(): void {
    this.router.navigate(['/create']);
  }
}
