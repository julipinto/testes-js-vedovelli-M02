import { mount } from '@vue/test-utils'
import Cart from '@/components/Cart.vue'

describe('Cart - unit', () => {
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
})
