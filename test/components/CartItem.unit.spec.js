import { mount } from '@vue/test-utils'
import CartItem from '@/components/CartItem.vue'
import { makeServer } from '@/miragejs/server'
import { CartManager } from '@/managers/CartManager'

describe('CartItem - unit', () => {
  let server

  beforeEach(() => {
    server = makeServer({ environment: 'test' })
  })

  afterEach(() => {
    server.shutdown({ environment: 'test' })
  })

  const mountCartItem = async (title = 'Any relógio', price = 22.33) => {
    const manager = new CartManager()

    const product = await server.create('product', { title, price })
    const wrapper = mount(CartItem, {
      propsData: { product },
      mocks: {
        $cart: manager,
      },
      stubs: {
        Nuxt: true,
      },
    })

    return { wrapper, product, manager }
  }

  it('should mount the component', async () => {
    const { wrapper } = await mountCartItem()
    expect(wrapper.vm).toBeDefined()
  })

  it('should display product info', async () => {
    const { wrapper, product } = await mountCartItem()
    expect(wrapper.text()).toContain(product.title)
    expect(wrapper.text()).toContain(`${product.price}`)
  })

  it('should display quantity 1 when product is first displayed', async () => {
    const { wrapper } = await mountCartItem()
    const quantity = wrapper.find('[data-testid="quantity"]')
    expect(quantity.text()).toContain('1')
  })

  it('it shoud increase quantity when plus button is clicked', async () => {
    const { wrapper } = await mountCartItem()
    const quantity = wrapper.find('[data-testid="quantity"]')
    const plusButton = wrapper.find('[data-testid="+"]')

    await plusButton.trigger('click')
    expect(quantity.text()).toContain('2')

    await plusButton.trigger('click')
    expect(quantity.text()).toContain('3')

    await plusButton.trigger('click')
    expect(quantity.text()).toContain('4')
  })

  it('it shoud increase quantity when minus button is clicked', async () => {
    const { wrapper } = await mountCartItem()
    const quantity = wrapper.find('[data-testid="quantity"]')
    const plusButton = wrapper.find('[data-testid="-"]')

    await plusButton.trigger('click')
    expect(quantity.text()).toContain('0')
  })

  it('should not allow quantity to be less than 0', async () => {
    const { wrapper } = await mountCartItem()
    const quantity = wrapper.find('[data-testid="quantity"]')
    const minusButton = wrapper.find('[data-testid="-"]')

    await minusButton.trigger('click')
    await minusButton.trigger('click')
    expect(quantity.text()).toContain('0')
  })

  it('should display a button to remove item from cart', async () => {
    const { wrapper } = await mountCartItem()
    const removeButton = wrapper.find('[data-testid="remove-button"]')
    expect(removeButton.exists()).toBe(true)
  })

  it('should remove item from cart when remove button is clicked', async () => {
    const { wrapper, manager, product } = await mountCartItem()
    const removeButton = wrapper.find('[data-testid="remove-button"]')
    const spy = jest.spyOn(manager, 'removeProduct')

    await removeButton.trigger('click')
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(product)
  })
})
