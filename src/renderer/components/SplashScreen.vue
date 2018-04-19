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
            <div class="component">Buscando actualizaciones</div>
            <div class="dots"></div>
          </el-col>
          <el-col :span="1"><i :class="{'el-icon-loading': !newUpdatesOk, 'el-icon-success': newUpdatesOk }"></i></el-col>
        </el-row>
        <el-row :gutter="10" class="loading-row">
          <el-col :span="23">
            <div class="component">Cargando informacion</div>
            <div class="dots"></div>
          </el-col>
          <el-col :span="1"><i :class="{'el-icon-loading': !loadDataOk, 'el-icon-success': loadDataOk }"></i></el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { createNamespacedHelpers as namespace } from 'vuex'
  import SystemInformation from './Admin/SystemInformation'

  const { mapGetters: tablesGetters, mapActions: tablesActions } = namespace('Tables')
  const { mapGetters: productsGetters, mapActions: productsActions } = namespace('Products')
  const { mapGetters: clientsGetters, mapActions: clientsActions } = namespace('Clients')

  export default {
    name: 'splas-screen',
    components: { SystemInformation },
    data () {
      return {
        connectionOk: false,
        loadDataOk: false,
        newUpdatesOk: false
      }
    },
    computed: {
      ...tablesGetters(['list']),
      ...clientsGetters(['list']),
      ...productsGetters(['list'])
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
        this.$http.get('http://localhost:3000/tables').then(response => {
          this.loadDataOk = true
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
</style>
