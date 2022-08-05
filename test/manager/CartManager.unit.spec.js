import { CartManager } from '@/managers/CartManager'
import { makeServer } from '@/miragejs/server'

describe('CartManager', () => {
  let server
  let manager

  beforeEach(() => {
    server = makeServer({ environment: 'test' })
    manager = new CartManager()
  })

  afterEach(() => {
    server.shutdown({ environment: 'test' })
  })

  it('should set cart to open', () => {
    const state = manager.open()
    expect(state.open).toBe(true)
  })

  it('should set cart to close', () => {
    const state = manager.close()
    expect(state.open).toBe(false)
  })

  it('should return the state', () => {
    const product = server.create('product')
    manager.open()
    manager.addProduct(product)
    const state = manager.getState()

    expect(state).toEqual({
      items: [product],
      open: true,
    })
  })

  it('should return true if the product is already in the cart', () => {
    const product = server.create('product')
    manager.addProduct(product)
    const isInCart = manager.productIsInTheCart(product)
    expect(isInCart).toBe(true)
  })

  it('should add product to cart only once', () => {
    const product = server.create('product')
    manager.addProduct(product)
    const state = manager.addProduct(product)
    expect(state.items).toHaveLength(1)
  })

  it('should remove product from the cart', () => {
    const product = server.create('product')
    manager.addProduct(product)
    const state = manager.removeProduct(product)
    expect(state.items).toHaveLength(0)
  })

  it('should clear cart', () => {
    const product1 = server.create('product')
    const product2 = server.create('product')

    manager.addProduct(product1)
    manager.addProduct(product2)
    manager.open()

    const state = manager.clearCart()

    expect(state.items).toHaveLength(0)
    expect(state.open).toBe(false)
  })

  it('getProducts should return the list of products', () => {
    const product1 = server.create('product')
    const product2 = server.create('product')

    manager.addProduct(product1)
    manager.addProduct(product2)

    const products = manager.getProducts()
    expect(products).toEqual([product1, product2])
  })

  it('should return true if cart is not empty', () => {
    const product1 = server.create('product')
    const product2 = server.create('product')

    manager.addProduct(product1)
    manager.addProduct(product2)

    const state = manager.hasProducts()
    expect(state).toBe(true)
  })
})
