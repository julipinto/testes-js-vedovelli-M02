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

  const manager = new CartManager()

  const wrapper = mount(ProductCard, {
    propsData: {
      product,
    },
    mocks: {
      $cart: manager,
    },
    stubs: {
      Nuxt: true,
    },
  })

  return { product, wrapper, manager }
}

describe('ProductCard - unit', () => {
  let server

  beforeEach(() => {
    server = makeServer({ environment: 'test' })
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
    const { wrapper, manager, product } = mountProduct(server)
    const spy1 = jest.spyOn(manager, 'open')
    const spy2 = jest.spyOn(manager, 'addProduct')

    await wrapper.find('button').trigger('click')

    expect(spy1).toHaveBeenCalledTimes(1)
    expect(spy2).toHaveBeenCalledTimes(1)
    expect(spy2).toHaveBeenCalledWith(product)
  })
})
