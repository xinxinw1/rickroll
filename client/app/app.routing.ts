import { RouterModule, Route } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { CreateComponent } from './create.component';
import { ListComponent } from './list.component';

const routes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list'
  },
  {
    path: 'create',
    component: CreateComponent
  },
  {
    path: 'list',
    component: ListComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, {useHash: true});
