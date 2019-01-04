import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-configure-instance',
  templateUrl: './configure-instance.component.html',
  styleUrls: ['./configure-instance.component.css']
})
export class ConfigureInstanceComponent implements OnInit {

  imageName = null

  constructor(
    private route: ActivatedRoute,
    private location: Location) { }

  ngOnInit() {
    this.imageName = this.route.snapshot.paramMap.get('imageName');
  }

  goBack(): void {
    this.location.back();
  }

  goCreate(): void {
    this.location.back();
  }

}
