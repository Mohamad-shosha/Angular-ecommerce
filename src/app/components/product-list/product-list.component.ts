import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/common/product';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';
import { HttpClient } from '@angular/common/http';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  currentCategoryName: string = '';
  searchMode: boolean = false;
  showPreviewModal: boolean = false;
  previewUrl: string | null =null;
  thePageNumber: number = 1;
  thePageSize: number = 8;
  theTotalElements: number = 0;
  previousKeyword: string = '';

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  handleSearchProducts() {
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;

    if (this.previousKeyword !== theKeyword) {
      this.thePageNumber = 1;
    }

    this.previousKeyword = theKeyword;

    this.productService
      .searchProductsPaginate(
        this.thePageNumber - 1,
        this.thePageSize,
        theKeyword
      )
      .subscribe(this.processResult());
  }

  handleListProducts() {
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
      this.currentCategoryName = this.route.snapshot.paramMap.get('name')!;
    } else {
      this.currentCategoryId = 1;
      this.currentCategoryName = 'T-Shirts';
    }

    if (this.previousCategoryId !== this.currentCategoryId) {
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    this.productService
      .getProductListPaginate(
        this.thePageNumber - 1,
        this.thePageSize,
        this.currentCategoryId
      )
      .subscribe(this.processResult());
  }

  updatePageSize(pageSize: string) {
    this.thePageSize = +pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }

  processResult() {
    return (data: any) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }

  addToCart(theProduct: Product) {
    const theCartItem = new CartItem(
      theProduct.id!,
      theProduct.name!,
      theProduct.imageUrl!,
      theProduct.unitPrice!
    );
    this.cartService.addToCart(theCartItem);
  }
tryNow(event: Event, product: Product) {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;

  const userImage = input.files[0];

  if (!product.imageUrl) {
    this.toastService.showError('Product image is not available.');
    return;
  }

  fetch(product.imageUrl)
    .then((res) => res.blob())
    .then((blob) => {
      const clothFile = new File([blob], 'cloth.png', { type: 'image/png' });

      const formData = new FormData();
      formData.append('user', userImage);
      formData.append('cloth', clothFile);

      this.http
        .post('https://sturgeon-handy-uniquely.ngrok-free.app/generate', formData, {
          responseType: 'arraybuffer',
        })
        .subscribe({
          next: (res) => {  
            const blob = new Blob([res], { type: 'image/jpeg' });
            const reader = new FileReader();
            reader.onload = () => {
            this.previewUrl = reader.result as string;
            this.showPreviewModal = true;
};
            reader.readAsDataURL(blob);
            this.toastService.showSuccess('Preview generated successfully!');
          },
          error: (err) => {
            console.error('Try-now error', err);
            this.toastService.showError('Failed to generate preview.');
          },
        });
    })
    .catch((err) => {
      console.error('Failed to fetch image', err);
      this.toastService.showError('Could not load product image.');
    });
}
}
