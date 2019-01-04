import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogComponent }      from './catalog/catalog.component';
import { InstancesComponent }      from './instances/instances.component';
import { ActivitiesComponent }      from './activities/activities.component';


const routes: Routes = [
  { path: '', redirectTo: '/catalog', pathMatch: 'full' },
  { path: 'catalog', component: CatalogComponent },
  { path: 'instances', component: InstancesComponent },
  { path: 'activities', component: ActivitiesComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes) 
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
