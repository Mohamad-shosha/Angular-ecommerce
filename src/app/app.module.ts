import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ProductService } from './services/product.service';
import { ProductListComponent } from './components/product-list/product-list.component';

@NgModule({
  declarations: [AppComponent], // Remove ProductListComponent from here
  imports: [BrowserModule, HttpClientModule, ProductListComponent], // Import it here
  providers: [ProductService],
  bootstrap: [AppComponent],
})
export class AppModule {}
