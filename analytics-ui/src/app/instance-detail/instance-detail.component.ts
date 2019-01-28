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

  /*
  whichForm = 'prophet2'
  inputParamDays = 365;
  inputDatabase = "";
  inputQuery = "";
  outputMeasurement = "";
  outputDatabase = "";
  */

  forecastFormDataBinding = {
    days : 365,
    inputDatabase : "analytics",
    inputQuery : 'SELECT "value" FROM "analytics"."autogen"."data"',
    outputDatabase : "analytics",
    outputMeasurement : "forecast"
  }

  trainFormDataBinding = {
    coefficient : 1.4,
    inputDatabase : "analytics",
    inputQuery : 'SELECT "value" FROM "analytics"."autogen"."activity"',
  }

  detectFormDataBinding = {
    deviations: 2,
    period: 5,
    inputDatabase : "analytics",
    inputQuery : "query",
    outputDatabase : "database",
    outputMeasurement : "measurement"    
  }

  constructor(private instanceService: InstancesService,private router: Router) { }

  ngOnInit() {
   }

  showAction(name) {
    if (this.instance.catalog.imageName == name) {
      return true;
    } else {
      console.log('instace.catalog.imageName',this.instance.catalog.imageName,name)
      return false;
    }
  }

  executeActionByIndex (actionIndex) {
    let body = null;
    
    /*
     * this has all degenerated as well because I haven't made the form generic then
     making this piece generic and data driven is jsut a waste of my time at this point
     for this hack prototype anyway
     */

    if (this.instance.catalog.actions[actionIndex].formType == 'forecast') {
      body = {
        action : "Generate Forecast",
        input: {
          query : {
              db : this.forecastFormDataBinding.inputDatabase,
              text: this.forecastFormDataBinding.inputQuery // 'SELECT "value" FROM "analytics"."autogen"."data"'
          }
        },
        output : {
          db : this.forecastFormDataBinding.outputDatabase, // "analytics",
          measurement : this.forecastFormDataBinding.outputMeasurement // "forecast"
        } 
      }
    }

    if (this.instance.catalog.actions[actionIndex].formType == 'mad-train') {
      body = {
        action : "Train Detector",
        input: {
          query : {
              db : this.trainFormDataBinding.inputDatabase,
              text: this.trainFormDataBinding.inputQuery 
          }
        }
      }
    }  

    if (this.instance.catalog.actions[actionIndex].formType == 'mad-detect') {
      // send in the period stuff as well
    }  

    this.instanceService.execute(this.instance.instanceName,body)
      .subscribe(obj=>{
        this.router.navigate(['/activities']);
      })
  }

  actionEnabledByIndex(index) {
    return true;
  }

  formByActionIndex(index) {
    return this.instance.catalog.actions[index].formType
  }

  isActionDisabledByIndex (index) {
    let currentState =  this.instance.state;
    if (this.instance.catalog.actions[index].enablingStates.indexOf(currentState)>=0) {
      return false;
    } else {
      return true;
    }
  }


}
