import { mount } from '@vue/test-utils'
import ProductCard from '@/components/ProductCard.vue'
import { makeServer } from '@/miragejs/server'
import { CartManager } from '@/managers/CartManager'

const mountProduct = (server) => {
  const product = server.create('product', {
    title: 'Relógio bonito',
    price: '22.00',
    image: 'some_link',
  })

  const wrapper = mount(ProductCard, {
    propsData: {
      product,
    },
    mocks: {
      $cart: new CartManager(),
    },
    stubs: {
      Nuxt: true,
    },
  })

  return { product, wrapper }
}

describe('ProductCard - unit', () => {
  let server
  let cartManager

  beforeEach(() => {
    server = makeServer({ environment: 'test' })
    cartManager = new CartManager()
  })

  afterEach(() => {
    server.shutdown({ environment: 'test' })
  })

  it('it should match snapshot', () => {
    const wrapper = mountProduct(server).wrapper
    expect(wrapper.element).toMatchSnapshot()
  })

  it('should mount the component', () => {
    const wrapper = mountProduct(server).wrapper
    expect(wrapper.vm).toBeDefined()
    expect(wrapper.text()).toContain('Relógio bonito')
    expect(wrapper.text()).toContain('22.00')
  })

  it('should add item to cartState on button click', async () => {
    const { wrapper } = mountProduct(server)
    await wrapper.find('button').trigger('click')
    expect(cartManager.getProducts()).toHaveLength(1)
  })
})
