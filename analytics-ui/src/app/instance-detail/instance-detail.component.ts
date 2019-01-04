import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-instance-detail',
  templateUrl: './instance-detail.component.html',
  styleUrls: ['./instance-detail.component.css']
})
export class InstanceDetailComponent implements OnInit {

  @Input() instance: any;

  constructor() { }

  ngOnInit() {
  }

}
