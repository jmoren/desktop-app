import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'splash-screen',
      component: require('@/components/SplashScreen').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
