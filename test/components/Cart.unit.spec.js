import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import Cart from '@/components/Cart.vue'
import CartItem from '@/components/CartItem.vue'
import { makeServer } from '@/miragejs/server'
import { CartManager } from '@/managers/CartManager'

describe('Cart - unit', () => {
  let server

  beforeEach(() => {
    server = makeServer({ environment: 'test' })
  })

  afterEach(() => {
    server.shutdown({ environment: 'test' })
  })

  const mountCart = () => {
    const products = server.createList('product', 2)
    const manager = new CartManager()
    const wrapper = mount(Cart, {
      propsData: {
        products,
      },
      mocks: {
        $cart: manager,
      },
      stubs: {
        Nuxt: true,
      },
    })

    return { products, wrapper, manager }
  }

  it('should mount the component', () => {
    const wrapper = mount(Cart)
    expect(wrapper.vm).toBeDefined()
  })

  it('should emit close event when click on close button', async () => {
    const { wrapper } = mountCart(Cart)
    const button = wrapper.find('[data-testid="close-button"]')
    await button.trigger('click')
    expect(wrapper.emitted().close).toBeTruthy()
    expect(wrapper.emitted().close.length).toBe(1)
  })

  it('should display the cart when no prop isOpen is passed', async () => {
    const { wrapper } = mountCart(Cart)
    await wrapper.setProps({ isOpen: true })
    expect(wrapper.classes()).not.toContain('hidden')
  })

  it("should display 'Cart is empty' when no items are passed", async () => {
    const { wrapper } = mountCart(Cart)
    wrapper.setProps({ products: [] })
    await nextTick()
    expect(wrapper.text()).toContain('Cart is empty')
  })

  it('should display 2 instances of CartItem when 2 items are passed', () => {
    const { wrapper } = mountCart()
    expect(wrapper.findAllComponents(CartItem)).toHaveLength(2)
    expect(wrapper.text()).not.toContain('Cart is empty')
  })

  it('should display a button to clear cart', async () => {
    const { wrapper } = await mountCart()
    const clearButton = wrapper.find('[data-testid="clear-cart-button"]')
    expect(clearButton.exists()).toBe(true)
  })

  it('should clearCart() when button is clicked', async () => {
    const { wrapper, manager } = await mountCart()
    const spy = jest.spyOn(manager, 'clearCart')
    const removeButton = wrapper.find('[data-testid="clear-cart-button"]')
    await removeButton.trigger('click')

    expect(spy).toHaveBeenCalledTimes(1)
  })
})
