import { mount } from '@vue/test-utils'
import Cart from '@/components/Cart.vue'
import CartItem from '@/components/CartItem.vue'
import { makeServer } from '@/miragejs/server'

describe('Cart - unit', () => {
  let server

  beforeEach(() => {
    server = makeServer({ environment: 'test' })
  })

  afterEach(() => {
    server.shutdown({ environment: 'test' })
  })

  it('should mount the component', () => {
    const wrapper = mount(Cart)
    expect(wrapper.vm).toBeDefined()
  })

  it('should emit close event when click on close button', async () => {
    const wrapper = mount(Cart)
    const button = wrapper.find('[data-testid="close-button"]')
    await button.trigger('click')
    expect(wrapper.emitted().close).toBeTruthy()
    expect(wrapper.emitted().close.length).toBe(1)
  })

  it('should display the cart when no prop isOpen is passed', () => {
    const wrapper = mount(Cart, {
      propsData: {
        isOpen: true,
      },
    })
    expect(wrapper.classes()).not.toContain('hidden')
  })

  it("should display 'Cart is empty' when no items are passed", () => {
    const wrapper = mount(Cart)
    expect(wrapper.text()).toContain('Cart is empty')
  })

  it('should display 2 instances of CartItem when 2 items are passed', () => {
    const products = server.createList('product', 2)
    const wrapper = mount(Cart, {
      propsData: {
        products,
      },
    })
    expect(wrapper.findAllComponents(CartItem)).toHaveLength(2)
    expect(wrapper.text()).not.toContain('Cart is empty')
  })
})
