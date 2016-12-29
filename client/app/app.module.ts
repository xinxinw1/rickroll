import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';

import { AppComponent }  from './app.component';
import { CreateComponent } from './create.component';
import { ListComponent } from './list.component';

import { PageService } from './page.service';
import { MessageService } from './message.service';

import { routing } from './app.routing';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    routing
  ],
  declarations: [
    AppComponent,
    CreateComponent,
    ListComponent
  ],
  providers: [
    PageService,
    MessageService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
