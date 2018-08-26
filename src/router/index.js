import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Block from '@/components/Blocks/Block'
import Ack from '@/components/Acks/Ack'
import Request from '@/components/Requests/Request'

Vue.use(Router)

const rv = {
  template: `<router-view></router-view>`
}

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/blocks',
      component: rv,
      children: [
        {
          path: ':db/:hash',
          name: 'Block',
          component: Block
        }
      ]
    },
    {
      path: '/acks',
      component: rv,
      children: [
        {
          path: ':db/:hash',
          name: 'Ack',
          component: Ack
        }
      ]
    },
    {
      path: '/requests',
      component: rv,
      children: [
        {
          path: ':db/:hash',
          name: 'Request',
          component: Request
        }
      ]
    }
  ]
})
