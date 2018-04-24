<template lang="html">
  <router-view></router-view>
</template>

<script>
import Icon from '@fortawesome/vue-fontawesome'
import { createNamespacedHelpers as namespace } from 'vuex'
const { mapActions: authActions } = namespace('auth')
const { mapActions: tablesActions } = namespace('tables')
const { mapActions: productsActions } = namespace('products')
const { mapActions: clientsActions } = namespace('clients')

export default {
  name: 'layout',
  components: { Icon },
  data () {
    return {
      loadTablesOk: false,
      loadClientsOk: false,
      loadProductsOk: false
    }
  },
  computed: {
    dataReady () {
      return this.loadTablesOk && this.loadClientsOk && this.loadProductsOk
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    ...authActions(['logout']),
    ...tablesActions(['fetchTables']),
    ...clientsActions(['fetchClients']),
    ...productsActions(['fetchProducts']),
    doLogout () {
      this.logout().then(() => {
        this.$router.push({ name: 'Login' })
      })
    },
    loadData () {
      this.fetchTables().then(() => {
        this.loadTablesOk = true
      }).catch(error => {
        console.log(error)
      })
      this.fetchClients().then(() => {
        this.loadClientsOk = true
      }).catch(error => {
        console.log(error)
      })
      this.fetchProducts().then(() => {
        this.loadProductsOk = true
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>

<style lang="css">
  .left-navbar {
    position: relative;
    height: 100vh;
    background: #f1f1f1;
    border-right: solid 2px #d4d4d4;
    text-align: center;
    padding-top: 40px;
    color: #333;
  }
  .left-navbar .button-item { position: relative; height: 80px; border-bottom: solid 1px #d4d4d4; padding-top: 20px; }
  .left-navbar .button-item .title { font-size: 12px; margin-top: 10px; }
  .left-navbar .button-item:first-child { margin-top: 30px; border-top: solid 1px #ddd; }
  .left-navbar .button-item.logout { position: absolute; bottom: 5px; left: 15px; border-bottom: none; }
  .main-content { height: 100vh; padding: 0px; margin: 0px; background: #fff; }
</style>
