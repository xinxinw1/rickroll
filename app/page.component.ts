import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { PageService } from './page.service';

import 'rxjs/add/operator/switchMap';

@Component({
  moduleId: module.id,
  selector: 'my-page',
  templateUrl: 'page.component.html',
})
export class PageComponent implements OnInit  {
  page: any;

  constructor(
    private pageService: PageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.switchMap((params: Params) =>
      this.pageService.get(params['tag'])
    ).subscribe(page => this.page = page);
  }
}
