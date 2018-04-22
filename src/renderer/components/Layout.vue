<template lang="html">
  <el-row :gutter="0">
    <el-col :span="1" class="left-navbar">
      <div class="button-item">
        <el-button type="primary" size="small" circle>
          <icon icon="plus"></icon>
        </el-button>
        <div class="title">Cliente</div>
      </div>
      <div class="button-item">
        <el-button type="primary" size="small" circle>
          <icon icon="plus"></icon>
        </el-button>
        <div class="title">Mesa</div>
      </div>
      <div class="button-item">
        <el-button type="primary" size="small" circle>
          <icon icon="plus"></icon>
        </el-button>
        <div class="title">Delivery</div>
      </div>
      <div class="button-item logout">
        <el-button type="danger" size="small" @click="doLogout()" circle>
          <icon icon="sign-out-alt"></icon>
        </el-button>
      </div>
    </el-col>
    <el-col :span="23" class="main-content" v-loading="!dataReady">
      <router-view></router-view>
    </el-col>
  </el-row>
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
    border-right: solid 2px #ddd;
    text-align: center;
    padding-top: 40px;
    color: #333;
  }
  .left-navbar .button-item { height: 50px; border-bottom: solid 1px #ddd; padding: 10px 0px; }
  .left-navbar .button-item .title { font-size: 12px; margin-top: 5px; }
  .left-navbar .button-item:first-child { margin-top: 30px; border-top: solid 1px #ddd; }
  .left-navbar .button-item.logout { position: absolute; bottom: 15px; left: 15px; border-bottom: none; }
  .main-content { height: 100vh; padding: 0px; margin: 0px; background: #fff; }
</style>
