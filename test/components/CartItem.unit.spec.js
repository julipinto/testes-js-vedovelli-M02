import { mount } from '@vue/test-utils'
import CartItem from '@/components/CartItem.vue'
import { makeServer } from '@/miragejs/server'

describe('CartItem - unit', () => {
  let server

  beforeEach(() => {
    server = makeServer({ environment: 'test' })
  })

  afterEach(() => {
    server.shutdown({ environment: 'test' })
  })

  const mountCartItem = async (title = 'Any relógio', price = 22.33) => {
    const product = await server.create('product', { title, price })
    const wrapper = mount(CartItem, { propsData: { product } })

    return { wrapper, product }
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
})
