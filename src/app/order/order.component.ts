import { Component, OnInit } from '@angular/core';
import { RadioOption } from 'app/shared/radio/radio-option.model';
import {FormGroup, FormBuilder, Validators} from '@angular/forms'
import { orderService } from './order.service';
import { CartItem } from 'app/restaurant-detail/shopping-cart/cart-item.model';
import { Order, OrderItem } from './order.model';
import { Router } from '@angular/router';

@Component({
  selector: 'mt-order',
  templateUrl: './order.component.html'
})
export class OrderComponent implements OnInit {

  orderForm: FormGroup

  emailPattern = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i

  numberPattern = /^[0-9]*$/




  delivery: number = 8

  paymentOptions: RadioOption[] = [
    { label: 'Dinheiro', value: 'MON' },
    { label: 'Cartão de Debito', value: 'DEB' },
    { label: 'Cartão Refeição', value: 'REF' }

  ]

  constructor(private OrderService: orderService, private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.orderForm = this.formBuilder.group({
      name: this.formBuilder.control('', [Validators.required, Validators.minLength(5)]),
      email: this.formBuilder.control('', [Validators.required, Validators.pattern(this.emailPattern)]),
      emailConfirmation: this.formBuilder.control('', [Validators.required, Validators.pattern(this.emailPattern)]),
      address: this.formBuilder.control('', [Validators.required, Validators.minLength(5)]),
      number: this.formBuilder.control('',[Validators.required, Validators.pattern(this.numberPattern)]),
      optionalAddress: this.formBuilder.control(''),
      paymentOption: this.formBuilder.control('', [Validators.required]),

    })
  }

  itemsValue(): number {
    return this.OrderService.itemsValue()
  }

  cartItem(): CartItem[] {
    return this.OrderService.cartItems()
  }

  increaseQty(item: CartItem) {
    this.OrderService.increaseQty(item)
  }

  decreaseQty(item: CartItem) {
    this.OrderService.decreaseQty(item)
  }

  remove(item: CartItem) {
    this.OrderService.remove(item)
  }

  checkOrder(order: Order) {
    order.OrderItems = this.cartItem()
      .map((item: CartItem) => new OrderItem(item.quantity, item.menuItem.id))

    this.OrderService.checkOrder(order)
      .subscribe((orderId: string) => {
        this.router.navigate(['/order-summary'])
        this.OrderService.clear()
      })

    console.log(order)
  }
}
