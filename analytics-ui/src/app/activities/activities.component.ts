import { Component, OnInit } from '@angular/core';
import {ActivitiesService} from '../activities.service'



@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css']
})
export class ActivitiesComponent implements OnInit {


  constructor(private activitiesService: ActivitiesService) { }

  activities = null;

  interval = null;

  ngOnInit() {
    this.interval = setInterval( () => {
      this.activitiesService.getActivities()
        .subscribe(activities => this.activities = activities); 
    },1000);
  }

  ngOnDestroy(){
    clearInterval(this.interval);
  }

}
