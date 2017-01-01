import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { PageService } from './page.service';
import { LocalPageService } from './localpage.service';
import { MessageService } from './message.service';
import { AuthService } from './auth.service';

@Component({
  selector: 'my-create',
  templateUrl: './create.component.html',
})
export class CreateComponent implements OnInit {
  message: string;

  constructor(
    private router: Router,
    private pageService: PageService,
    private localPageService: LocalPageService,
    private messageService: MessageService,
    private authService: AuthService,
    private location: Location
  ) {}
  
  ngOnInit(): void {
    this.message = this.messageService.collect('message');
  }

  create(name: string, pretend: string, redirect: string): void {
    if (!name || !pretend || !redirect) {
      this.message = 'Some fields empty';
      return;
    }
    this.pageService.create(name, pretend, redirect)
      .then(obj => {
        this.messageService.set('message', obj.message);
        this.localPageService.set(name, obj.token);
        this.router.navigate(['/view', name]);
      })
      .catch(err => this.message = `Fail! ${err}`);
  }
  
  back(): void {
    this.location.back();
  }
}
