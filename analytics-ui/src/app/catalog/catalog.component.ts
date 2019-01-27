import { Component, OnInit } from '@angular/core';
import { CatalogService} from '../catalog.service'

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {

  constructor(private catalogService: CatalogService) { }

  catalogItems = null;

  selectedItem = null;

  displayedColumns = ["name","description","tags"]

  interval = null;

  ngOnInit() {
    this.catalogService.getCatalogItems()
      .subscribe(items => {
        this.catalogItems = items
        this.interval = setInterval( () => {
          this.catalogService.getCatalogItems()
            .subscribe(items => this.catalogItems = items); 
        },1000);
      });
  }

  ngOnDestroy(){
    clearInterval(this.interval);
  }

  onSelect (item) {
    this.selectedItem = item;
  }

}
