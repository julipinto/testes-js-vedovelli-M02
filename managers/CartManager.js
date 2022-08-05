import Vue from 'vue'

export default {
  install: (Vue) => {
    /* This line will be ignored on coverage */
    // istanbul ignore next
    Vue.prototype.$cart = new CartManager()
  },
}

const initialState = {
  open: false,
  items: [],
}

export class CartManager {
  state

  constructor() {
    this.state = Vue.observable(initialState)
  }

  open() {
    this.state.open = true
    return this.state
  }

  close() {
    this.state.open = false
    return this.state
  }

  productIsInTheCart(product) {
    return !!this.state.items.find((item) => item.id === product.id)
  }

  addProduct(product) {
    if (!this.productIsInTheCart(product)) {
      this.state.items.push(product)
    }

    return this.state
  }

  removeProduct(product) {
    this.state.items = [
      ...this.state.items.filter((item) => item.id !== product.id),
    ]
    return this.state
  }

  clearProducts() {
    this.state.items = []
    return this.state
  }

  clearCart() {
    this.clearProducts()
    this.close()
    return this.state
  }

  hasProducts() {
    return this.state.items.length > 0
  }

  getState() {
    return this.state
  }

  getProducts() {
    return this.state.items
  }
}
