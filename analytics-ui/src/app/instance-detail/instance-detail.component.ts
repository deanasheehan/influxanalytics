import { Component, OnInit, Input } from '@angular/core';
import { InstancesService } from '../instances.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-instance-detail',
  templateUrl: './instance-detail.component.html',
  styleUrls: ['./instance-detail.component.css']
})
export class InstanceDetailComponent implements OnInit {

  @Input() instance: any;

  inputParamDays = 365;
  inputDatabase = "";
  inputQuery = "";
  outputMeasurement = "";
  outputDatabase = "";

  constructor(private instanceService: InstancesService,private router: Router,) { }

  ngOnInit() {
  }

  execute () {
    let body = {
      action : "Generate Forecast",
      input: {
        query : {
            db : "analytics", // TODO
            text: this.inputQuery // 'SELECT "value" FROM "analytics"."autogen"."data"'
        }
      },
      output : {
        db : this.outputDatabase, // "analytics",
        measurement : this.outputMeasurement // "forecast"
      } 
    }

    this.instanceService.execute(this.instance.instanceName,body)
      .subscribe(obj=>{
        this.router.navigate(['/activities']);
      })
  }

}
