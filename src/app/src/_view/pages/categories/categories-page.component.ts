import {Component, OnInit} from '@angular/core';
import {CategoryEntity, ShopRepository} from '../../../_data';

@Component({
  selector: 'app-categories-page',
  styleUrls: ['./categories-page.component.scss'],
  templateUrl: './categories-page.component.html'
})
export class CategoriesPageComponent implements OnInit {
  /// fields
  public categories: Array<CategoryEntity> = [];

  /// predicates
  public isLoaded = false;

  /// constructor
  constructor(private shopRepository: ShopRepository) {
  }

  ngOnInit(): void {
    this.shopRepository.getCategories().subscribe(data => {
      this.categories = data;
      this.isLoaded = true;
    });
  }

  public showSubCategories(id:number){

  }
}