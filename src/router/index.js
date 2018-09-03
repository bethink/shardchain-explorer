import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Block from '@/components/Blocks/Block'
import BlockList from '@/components/Blocks/BlockList'
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
          // TEST URL: http://localhost:8080/#/blocks/057e55460f501ad071383c95f691293f2f0a7895988e22593669ceeb52a6452a
          path: ':db',
          name: 'BlockList',
          component: BlockList
        },
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
