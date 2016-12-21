import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { AppComponent }  from './app.component';
import { CreateComponent } from './create.component';
import { PageComponent } from './page.component';

import { PageService } from './page.service';

import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: CreateComponent
  },
  {
    path: ':tag',
    component: PageComponent
  }
];

@NgModule({
  imports:      [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  declarations: [ AppComponent, CreateComponent, PageComponent ],
  providers: [ PageService ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
