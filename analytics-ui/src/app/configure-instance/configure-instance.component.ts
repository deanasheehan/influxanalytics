import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { CatalogService} from '../catalog.service'
import { InstancesService} from '../instances.service'

@Component({
  selector: 'app-configure-instance',
  templateUrl: './configure-instance.component.html',
  styleUrls: ['./configure-instance.component.css']
})
export class ConfigureInstanceComponent implements OnInit {

  imageName = null
  catalogItem = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private catalogService: CatalogService,
    private instancesService: InstancesService) { }

    instanceName = "";
    instanceDescription = "";
    instanceInputQuery = "";
    configDays = "";

    ngOnInit() {
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

      // post to instances
      console.log('create instance',this.instanceName,this.instanceDescription,this.instanceInputQuery,this.configDays)


      this.router.navigate(['/instances']);
    }

    hasParam (name) {
      return true;
    }
}
