import { Component, OnInit } from '@angular/core';
import {ActivitiesService} from '../activities.service'

export interface Activity {
  date: Date;
  name: string;
  action: string;
  state: string;
}

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css']
})
export class ActivitiesComponent implements OnInit {


  constructor(private activitiesService: ActivitiesService) { }

  activities: Activity[] = [];

  interval = null;

  displayedColumns = ["date","name","action","state"]

  ngOnInit() {
    this.activitiesService.getActivities()
    .subscribe(activities => {
      this.activities = <Activity[]>activities
      this.interval = setInterval( () => {
        this.activitiesService.getActivities()
          .subscribe(activities => this.activities = <Activity[]>activities); 
      },1000);
    }); 
  }

  ngOnDestroy(){
    clearInterval(this.interval);
  }

}
