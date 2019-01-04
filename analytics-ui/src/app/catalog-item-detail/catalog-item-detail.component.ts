import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-catalog-item-detail',
  templateUrl: './catalog-item-detail.component.html',
  styleUrls: ['./catalog-item-detail.component.css']
})
export class CatalogItemDetailComponent implements OnInit {

  @Input() catalogItem: any;

  constructor() { }

  ngOnInit() {
  }

}
