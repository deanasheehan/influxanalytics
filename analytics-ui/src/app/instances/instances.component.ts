import { Component, OnInit } from '@angular/core';
import { InstancesService } from '../instances.service'

@Component({
  selector: 'app-instances',
  templateUrl: './instances.component.html',
  styleUrls: ['./instances.component.css']
})
export class InstancesComponent implements OnInit {

  instanceItems = null
  selectedInstance = null
  displayedColumns = ["instanceName","description","state"]


  constructor(private instancesService: InstancesService) { }

  ngOnInit() {
    this.instancesService.getInstances()
      .subscribe(items => this.instanceItems = items);
  }

  onSelect (item) {
    this.selectedInstance = item;
  }

}
