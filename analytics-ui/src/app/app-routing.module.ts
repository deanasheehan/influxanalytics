import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogComponent }      from './catalog/catalog.component';
import { InstancesComponent }      from './instances/instances.component';
import { ActivitiesComponent }      from './activities/activities.component';
import { ConfigureInstanceComponent }      from './configure-instance/configure-instance.component';


const routes: Routes = [
  { path: '', redirectTo: '/catalog', pathMatch: 'full' },
  { path: 'catalog', component: CatalogComponent },
  { path: 'instances', component: InstancesComponent },
  { path: 'activities', component: ActivitiesComponent },
  { path: 'configure/:imageName', component: ConfigureInstanceComponent },
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
