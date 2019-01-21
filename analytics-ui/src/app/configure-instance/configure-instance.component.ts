import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { CatalogService} from '../catalog.service'
import { InstancesService} from '../instances.service'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import  nameGenerator from '@afuggini/namegenerator';

@Component({
  selector: 'app-configure-instance',
  templateUrl: './configure-instance.component.html',
  styleUrls: ['./configure-instance.component.css']
})
export class ConfigureInstanceComponent implements OnInit {

  private analyticsApi = 'http://localhost:3000/instances';  // URL to web api

  imageName = null
  catalogItem = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private catalogService: CatalogService,
    private instancesService: InstancesService,
    private http: HttpClient) { }

    instanceName = "";
    instanceDescription = "A default description - please replace";

    ngOnInit() {
      this.instanceName = nameGenerator('-')
      this.instanceName = this.instanceName.charAt(0).toUpperCase() + this.instanceName.slice(1);
      this.imageName = this.route.snapshot.paramMap.get('imageName');
      this.catalogService.getItemByName(this.imageName,(error,item)=>{
        console.log('have looked up imageName and found it',this.imageName,item)
        this.catalogItem = item;
      });
    }

    goBack(): void {
      this.location.back();
    }

    goCreate(): void {

      let instanceDoc = {
        instanceName: this.instanceName,
        instanceDescription: this.instanceDescription,
        catalog : this.catalogItem
      }

      const httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      };

      this.http.post(this.analyticsApi,instanceDoc,httpOptions)
        .subscribe(obj=>{
          this.router.navigate(['/instances']);
        })
    }

    hasParam (name) {
      return true;
    }
}
