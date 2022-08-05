import { mount } from '@vue/test-utils'
import DefaultLayout from '@/layouts/Default.vue'
import { CartManager } from '@/managers/CartManager'

describe('Default - unit', () => {
  const mountLayout = () => {
    const wrapper = mount(DefaultLayout, {
      mocks: {
        $cart: new CartManager(),
      },
      stubs: {
        Nuxt: true,
      },
    })
    return { wrapper }
  }

  it('should mount the component', () => {
    const { wrapper } = mountLayout()
    expect(wrapper.vm).toBeDefined()
  })

  it('should toggle cart state', async () => {
    const { wrapper } = mountLayout()
    const button = wrapper.find('[data-testid="toggle-button"]')
    await button.trigger('click')
    expect(wrapper.vm.$cart.state.open).toBe(true)
    await button.trigger('click')
    expect(wrapper.vm.$cart.state.open).toBe(false)
  })
})
