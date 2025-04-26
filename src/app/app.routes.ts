import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { LabsComponent } from './pages/labs/labs.component';

export const routes: Routes = [
  {
    path: '',// si esto queda vacio, por defecto lo lleva a la base
    component: HomeComponent
  },

  {
    path: 'labs',
    component: LabsComponent
  },

];
