import { Component, OnInit } from '@angular/core';
import { ProductCategory } from '../../common/product-category';
import { ProductService } from '../../services/product.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-product-category-menu',
  templateUrl: './product-category-menu.component.html',
  styleUrls: ['./product-category-menu.component.css'],
})
export class ProductCategoryMenuComponent implements OnInit {
  productCategoreies: ProductCategory[] = [];
  userRole: string = '';
  constructor(
    private productService: ProductService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.listProductCategories();
    this.userRole = this.authService.getUserRole() ?? '';
  }
  listProductCategories() {
    this.productService.getProductCategories().subscribe((data) => {
      console.log('Product Categories = ' + JSON.stringify(data));
      this.productCategoreies = data;
    });
  }
}
