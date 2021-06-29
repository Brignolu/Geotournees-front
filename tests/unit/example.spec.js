import Vue from 'vue'
import { shallowMount} from '@vue/test-utils'
import ConnexionRacine from '@/components/ConnexionRacine.vue'


import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue);

describe('ConnexionRacine.vue', () => {
  it('test h4', () => {
    const wrapper = shallowMount(ConnexionRacine);
    expect(wrapper.find('h4').exists()).toBe(true)
  })
})
