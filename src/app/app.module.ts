import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';
import { SearchComponent } from './components/search/search.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { CartStatusComponent } from './components/cart-status/cart-status.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { HomepageComponent } from './components/user/homepage/homepage.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { AuthGuard } from './guards/auth.guard';

import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { ToastComponent } from './components/toast/toast.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'products', component: ProductListComponent },
      { path: 'category', component: ProductListComponent },
      { path: 'category/:id/:name', component: ProductListComponent },
      { path: 'search/:keyword', component: ProductListComponent },
      { path: 'products/:id', component: ProductDetailsComponent },
      {
        path: 'cart-details',
        component: CartDetailsComponent,
        canActivate: [AuthGuard],
        data: { roles: ['CUSTOMER'] },
      },
      {
        path: 'checkout',
        component: CheckoutComponent,
        canActivate: [AuthGuard],
        data: { roles: ['CUSTOMER'] },
      },

      {
        path: 'admin/dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard],
        data: { roles: ['ADMIN'] },
      },
      {
        path: 'user/homepage',
        component: HomepageComponent,
        canActivate: [AuthGuard],
        data: { roles: ['CUSTOMER'] },
      },
      { path: '', redirectTo: 'products', pathMatch: 'full' },
    ],
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: 'auth/login', component: LoginComponent },
      { path: 'auth/register', component: RegisterComponent },
    ],
  },
  { path: '**', redirectTo: 'products' },
];

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductCategoryMenuComponent,
    SearchComponent,
    ProductDetailsComponent,
    CartStatusComponent,
    CartDetailsComponent,
    CheckoutComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    HomepageComponent,
    MainLayoutComponent,
    AuthLayoutComponent,
    ToastComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgbModule,

    ReactiveFormsModule,
    RouterModule.forRoot(routes),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    AuthGuard,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
