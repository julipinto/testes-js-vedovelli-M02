import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import axios from 'axios'
import ProductList from '@/pages/index.vue'
import ProductCard from '@/components/ProductCard.vue'
import Search from '@/components/Search.vue'
import { makeServer } from '@/miragejs/server'

jest.mock('axios', () => ({
  get: jest.fn(),
}))

describe('ProductList - integration', () => {
  let server

  beforeEach(() => {
    server = makeServer({ environment: 'test' })
  })

  afterEach(() => {
    server.shutdown({ environment: 'test' })
  })

  const getProducts = async (quantity = 10, override = []) => {
    let overrideList = []

    if (override.length > 0) {
      overrideList = override.map((o) => server.create('product', o))
    }

    const products = [
      ...(await server.createList('product', quantity)),
      ...overrideList,
    ]

    return products
  }

  it('should mount the component', () => {
    const wrapper = mount(ProductList)
    expect(wrapper.vm).toBeDefined()
  })

  it('should mount the Search component as a child', () => {
    const wrapper = mount(Search)
    expect(wrapper.vm).toBeDefined()
  })

  it('should call axios.get on component mount', () => {
    mount(ProductList, {
      mocks: {
        $axios: axios,
      },
    })

    expect(axios.get).toHaveBeenCalledTimes(1)
    expect(axios.get).toHaveBeenCalledWith('/api/products')
  })

  it('should mount the ProductCard component 11 times', async () => {
    const products = await getProducts(undefined, [{ name: 'any watcher' }])
    axios.get.mockReturnValue(Promise.resolve({ data: { products } }))

    const wrapper = mount(ProductList, {
      mocks: {
        $axios: axios,
      },
    })

    await nextTick()

    const cards = wrapper.findAllComponents(ProductCard)
    expect(cards).toHaveLength(11)
  })

  it('shoud display the error message when Promise rejects', async () => {
    axios.get.mockReturnValue(Promise.reject(new Error('Error')))

    const wrapper = mount(ProductList, {
      mocks: {
        $axios: axios,
      },
    })

    await nextTick()
    expect(wrapper.text()).toContain('Problemas ao carregar a lista!')
  })

  it('should filter the product list when when a search is performed', async () => {
    // Arrange
    const products = await getProducts(undefined, [
      {
        name: 'super relógio',
      },
    ])

    axios.get.mockReturnValue(Promise.resolve({ data: { products } }))

    const wrapper = mount(ProductList, {
      mocks: {
        $axios: axios,
      },
    })

    const term = 'relógio'
    await nextTick()

    // Act
    const search = wrapper.findComponent(Search)
    search.findAll('input[type="search"]').at(0).setValue(term)
    await search.find('form').trigger('submit')
    search.findAll('input[type="search"]').at(0).setValue('')
    await search.find('form').trigger('submit')

    // Assert
    const cards = wrapper.findAllComponents(ProductCard)
    expect(wrapper.vm.searchTerm).toEqual('')
    expect(cards).toHaveLength(11)
  })
})
