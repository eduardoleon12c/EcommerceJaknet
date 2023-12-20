import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { CartService } from 'src/app/modules/ecommerce-guest/_services/cart.service';
import { EcommerceGuestService } from 'src/app/modules/ecommerce-guest/_services/ecommerce-guest.service';
import { HomeService } from 'src/app/modules/home/_services/home.service';

declare var $:any
declare function HOMEINITTEMPLATE([]):any;
declare function alertDanger([]):any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,AfterViewInit {

  listCarts:any = [];

  totalCarts:any = 0;
  user:any;
  categories:any = [];
  search_product:any = null;
  products_search:any = [];
  categories_selecteds:any = [];
  our_products:any = [];
  bestProducts:any=[];

  source:any;
  @ViewChild("filter") filter?:ElementRef;
  constructor(
    public router: Router,
    public cartService: CartService,
    public homeService: HomeService,
    public ecommerceGuest:EcommerceGuestService,
  ) { }

  ngOnInit(): void {
    this.user = this.cartService._authService.user;
    let TIME_NOW = new Date().getTime();
    this.homeService.listHome(TIME_NOW).subscribe((resp:any) => {
      this.categories = resp.categories;
      this.our_products = resp.our_products;
      this.bestProducts = resp.best_products;
      setTimeout(() => {
        HOMEINITTEMPLATE($);
      }, 50);
    });
    this.cartService.currentDataCart$.subscribe((resp:any) => {
      console.log(resp);
      this.listCarts = resp;
      this.totalCarts = this.listCarts.reduce((sum:any,item:any) => sum + item.total, 0);
    })
    if(this.cartService._authService.user){
      this.cartService.lisCarts(this.cartService._authService.user._id).subscribe((resp:any) => {
        console.log(resp);
        // this.listCarts = resp.carts;
        resp.carts.forEach((cart:any) => {
          this.cartService.changeCart(cart);
        });
      })
    }
  }

  ngAfterViewInit(): void {
    this.source = fromEvent(this.filter?.nativeElement, "keyup");
    this.source.pipe(debounceTime(500)).subscribe((c:any) => {
      // console.log(this.search_product);
      let data = {
        search_product: this.search_product,
      }
      if(this.search_product.length > 1){
        this.cartService.searchProduct(data).subscribe((resp:any) => {
          console.log(resp);
          this.products_search = resp.products;
        })
      }
    })
  }
  
  isHome(){
    return this.router.url == "" || this.router.url == "/" ? true : false;
  }
  
  logout(){
    this.cartService._authService.logout();
  }
  
  getRouterDiscount(product:any){
    if(product.campaing_discount){
      return {_id:product.campaing_discount._id};
    }
    return {};
  }

  getDiscountProduct(product:any){
    if(product.campaing_discount){
      if(product.campaing_discount.type_discount == 1){//porcentaje
        return product.price_pesos*product.campaing_discount.discount*0.01;
      }else{//moneda
        return product.campaing_discount.discount;
      }
    }
    return 0;
  }

  dec(cart:any){
    if(cart.cantidad - 1 == 0){
      alertDanger("NO PUEDES DISMINUIR UN PRODUCTO A CERO");
      return;
    }

    cart.cantidad = cart.cantidad - 1;
    cart.subtotal = cart.price_unitario ;
    cart.total = cart.price_unitario * cart.cantidad;

    
    // AQUI VA LA FUNCION PARA ENVIARLO AL SERVICIE O BACKEND
    console.log(cart,"DEC");
    let data = {
      _id: cart._id,
      cantidad: cart.cantidad,
      subtotal: cart.subtotal,
      total: cart.total,
      variedad: cart.variedad ? cart.variedad._id : null,
      product: cart.product._id,
    }
    this.cartService.updateCart(data).subscribe((resp:any) => {
      console.log(resp);
    })
  }

  inc(cart:any) {
    console.log(cart,"INC");

    cart.cantidad = cart.cantidad + 1;
    cart.subtotal = cart.price_unitario;
    cart.total = cart.price_unitario * cart.cantidad;

    let data = {
      _id: cart._id,
      cantidad: cart.cantidad,
      subtotal: cart.subtotal,
      total: cart.total,
      variedad: cart.variedad ? cart.variedad._id : null,
      product: cart.product._id,
    }

    this.cartService.updateCart(data).subscribe((resp:any) => {
      console.log(resp);
    })
    // AQUI VA LA FUNCION PARA ENVIARLO AL SERVICIE O BACKEND
  }

  removeCart(cart:any){
    this.cartService.deleteCart(cart._id).subscribe((resp:any) =>{
      console.log(resp);
      this.cartService.removeItemCart(cart);
    })
  }

  searchProduct(){

  }
}
