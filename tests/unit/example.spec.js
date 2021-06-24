import Vue from 'vue'
import { shallowMount} from '@vue/test-utils'
import Login from '@/components/Login.vue'


import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue);

describe('Login.vue', () => {
  it('test h4', () => {
    const wrapper = shallowMount(Login);
    expect(wrapper.find('h4').exists()).toBe(true)
  })
})
