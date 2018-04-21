<template>
  <div class="main">
    <el-row :gutter="20">
      <el-col :span="8" class="left-side">
        <img id="logo" src="~@/assets/bar3-1.png" alt="Barmanager V3">
        <system-information></system-information>
      </el-col>
      <el-col :span="16" class="right-side">
        <el-row :gutter="10" class="loading-row">
          <el-col :span="23">
            <div class="component">Conectando al servidor</div>
            <div class="dots"></div>
          </el-col>
          <el-col :span="1"><i :class="{'el-icon-loading': !connectionOk, 'el-icon-success': connectionOk }"></i></el-col>
        </el-row>
        <el-row :gutter="10" class="loading-row">
          <el-col :span="23">
            <div class="component">Cargando Mesas ({{this.tableList.length}})</div>
            <div class="dots"></div>
          </el-col>
          <el-col :span="1"><i :class="{'el-icon-loading': !loadTablesOk, 'el-icon-success': loadTablesOk }"></i></el-col>
        </el-row>
        <el-row :gutter="10" class="loading-row">
          <el-col :span="23">
            <div class="component">Cargando Clientes ({{this.clientList.length}})</div>
            <div class="dots"></div>
          </el-col>
          <el-col :span="1"><i :class="{'el-icon-loading': !loadClientsOk, 'el-icon-success': loadClientsOk }"></i></el-col>
        </el-row>
        <el-row :gutter="10" class="loading-row">
          <el-col :span="23">
            <div class="component">Cargando Productos ({{this.productList.length}})</div>
            <div class="dots"></div>
          </el-col>
          <el-col :span="1"><i :class="{'el-icon-loading': !loadProductsOk, 'el-icon-success': loadProductsOk }"></i></el-col>
        </el-row>
        <div class="login-section" v-if="dataReady">
          <el-button type="danger">Login</el-button>
        </div>

      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { createNamespacedHelpers as namespace } from 'vuex'
  import SystemInformation from './Admin/SystemInformation'

  const { mapGetters: tablesGetters, mapActions: tablesActions } = namespace('tables')
  const { mapGetters: productsGetters, mapActions: productsActions } = namespace('products')
  const { mapGetters: clientsGetters, mapActions: clientsActions } = namespace('clients')

  export default {
    name: 'splas-screen',
    components: { SystemInformation },
    data () {
      return {
        connectionOk: false,
        loadTablesOk: false,
        loadClientsOk: false,
        loadProductsOk: false
      }
    },
    computed: {
      ...tablesGetters(['tableList']),
      ...clientsGetters(['clientList']),
      ...productsGetters(['productList']),
      dataReady () {
        return this.loadTablesOk && this.loadClientsOk && this.loadProductsOk && this.connectionOk
      }
    },
    created () {
      this.checkConnection()
    },
    methods: {
      ...tablesActions(['fetchTables']),
      ...clientsActions(['fetchClients']),
      ...productsActions(['fetchProducts']),
      checkConnection () {
        this.$http.get('http://localhost:3000/ping').then(response => {
          this.connectionOk = true
          this.loadData()
        }).catch(error => {
          console.log(error)
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

<style>
  .left-side {
    text-align: left;
    padding: 60px !important;
    border-right: solid 1px #999;
    border-radius: 0px;
    height: 100vh;
  }
  .right-side {
    padding: 60px !important;
  }
  .right-side .loading-row {
    font-size: 20px;
    height: 60px;
    line-height: 60px;
    color: #333;
    display: flex;
    justify-content: space-between;
  }
  .right-side .loading-row .component {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .right-side .loading-row .component:after {
    content: " ........................................................................................................................................................................................................................................................................................."
  }
  .right-side .loading-row .dots {
    flex-shrink: 0;
  }
  .left-side img {
    width: 100%;
  }
  .login-section {
    margin: 40px auto;
    padding: 10px;
    width: 100px;
  }
  .login-section .el-button { width: 100%; }
</style>
