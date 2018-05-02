<template lang="html">
  <div class="panels">
    <div class="left-panel">  
      <el-popover
        placement="right-start"
        width="200"
        trigger="click">
        <div class="popover-title">Mesas</div>
        <ul class="popover-options">
          <li>
            <router-link :to="{ name: 'tables' }">
              <span class="popover-icon"><icon icon='clipboard'></icon></span>
              Mesas
            </router-link>
          </li>
          <li>
            <a @click="openModal('open-table')">
              <span class="popover-icon"><icon icon='unlock'></icon></span>
              Abrir Mesa
            </a>
          </li>
          <li>
            <a @click="openModal('new-table')">
              <span class="popover-icon"><icon icon='plus'></icon></span>
              Nueva Mesa
            </a>
          </li>
          <li><a href="#"><span class="popover-icon"><icon icon='search'></icon></span> Ver Mapa</a></li>
        </ul>
        <div class="left-panel-option" slot="reference">
          <icon icon='utensils'></icon>
        </div>
      </el-popover>
      <el-popover
        placement="right-start"
        width="200"
        trigger="click">
        <div class="popover-title">Tickets</div>
        <ul class="popover-options">
          <li><a href="#"><span class="popover-icon"><icon icon='clipboard'></icon></span> Tickets Abiertos</a></li>
          <li><a href="#"><span class="popover-icon"><icon icon='search'></icon></span> Todos los tickets</a></li>
        </ul>
        <div class="left-panel-option" slot="reference" >
          <icon icon='sticky-note'></icon>
        </div>
      </el-popover>
      <el-popover
        placement="right-start"
        width="200"
        trigger="click">
        <div class="popover-title">Deliveries</div>
        <ul class="popover-options">
          <li><a href="#"><span class="popover-icon"><icon icon='clipboard'></icon></span> Tickets Sin enviar</a></li>
          <li><a href="#"><span class="popover-icon"><icon icon='plus'></icon></span> Crear Delivery</a></li>
          <li><a href="#"><span class="popover-icon"><icon icon='search'></icon></span> Entregados</a></li>
        </ul>
        <div class="left-panel-option" slot="reference">
          <icon icon='truck'></icon>
        </div>
      </el-popover>
      <el-popover
        placement="right-start"
        width="200"
        trigger="click">
        <div class="popover-title">Clientes</div>
        <ul class="popover-options">
          <li class="no-border">
            <client-search ref="searchForm"></client-search>
          </li>
          <li>
            <router-link :to="{ name: 'clients' }">
              <span class="popover-icon"><icon icon='users'></icon></span>
              Clientes
            </router-link>
          </li>
          <li>
            <a @click="openModal('new-client')">
              <span class="popover-icon"><icon icon='plus'></icon></span>
              Nuevo Cliente
            </a>
          </li>
        </ul>
        <div class="left-panel-option" slot="reference">
          <icon icon='users'></icon>
        </div>
      </el-popover>
      <div class="left-panel-option">
        <el-tooltip effect="dark" placement="right" content="Administracion">
          <icon icon='cog'></icon>
        </el-tooltip>
      </div>
      <div class="left-panel-option">
        <el-tooltip effect="dark" placement="right" content="Salir">
          <icon icon='sign-out-alt'></icon>
        </el-tooltip>
        </div>
    </div>
    <div class="right-panel">
      <router-view></router-view>
    </div>
    <div v-if="currentComponent">
      <component @done="removeComponent()" :is="currentComponent"></component>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Icon from '@fortawesome/vue-fontawesome'
import ClientSearch from '@/components/Shared/ClientSearch'
import NewTable from '@/components/Modals/NewTable'
import NewClient from '@/components/Modals/NewClient'
import OpenTable from '@/components/Modals/OpenTable'

import { createNamespacedHelpers as namespace } from 'vuex'
import { ipcRenderer } from 'electron'

const { mapActions: authActions } = namespace('auth')
const { mapActions: tablesActions } = namespace('tables')
const { mapActions: productsActions } = namespace('products')
const { mapActions: clientsActions } = namespace('clients')
const { mapActions: categoriesActions } = namespace('categories')

Vue.component('new-table', NewTable)
Vue.component('new-client', NewClient)
Vue.component('open-table', OpenTable)

export default {
  name: 'layout',
  components: { Icon, ClientSearch },
  data () {
    return {
      loadTablesOk: false,
      loadClientsOk: false,
      loadProductsOk: false,
      loadCategoriesOk: false,
      modalOpen: false,
      currentComponent: '',
      currentTitle: ''
    }
  },
  computed: {
    dataReady () {
      return this.loadTablesOk && this.loadClientsOk && this.loadProductsOk
    }
  },
  created () {
    this.loadData()
    ipcRenderer.on('open-search', (event) => {
      this.$nextTick(() => {
        this.$refs.searchForm.open()
      })
    })
  },
  methods: {
    ...authActions(['logout']),
    ...tablesActions(['fetchTables']),
    ...clientsActions(['fetchClients']),
    ...productsActions(['fetchProducts']),
    ...categoriesActions(['fetchCategories']),
    doLogout () {
      this.logout().then(() => {
        this.$router.push({ name: 'Login' })
      })
    },
    openModal (component) {
      this.currentComponent = component
    },
    removeComponent () {
      console.log('remove component')
      this.currentComponent = ''
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
      this.fetchCategories().then(() => {
        this.loadCategoriesOk = true
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
  .panels { height: 100vh; padding: 0px; margin: 0px; background: #fff; }
  .panels .left-panel { padding-top: 4.5em; text-align: center; color: #333; width: 60px;
    position: fixed; height: 100vh; background: #f1f1f1; z-index: 10; border-right: solid 1px #ccc;}
  .panels .left-panel .left-panel-option { 
    margin: 0px 0px;
    font-size: 20px;
    padding: 10px 0px;
    cursor: pointer;
    height: 40px;
    line-height: 35px;
  }
  .panels .left-panel .left-panel-option:hover,
  .panels .left-panel .left-panel-option:focus { color: #333; background: #E5E5E5; }
  .panels .right-panel { padding-left: 60px; height: 100vh; background: #fff; }

  .popover-title { color: #606266; border-bottom: solid 1px #C0C4CC; padding-bottom: 5px; margin-bottom: 10px; }
  .popover-options { margin: 0px; padding: 0px; list-style: none; }
  .popover-options li { height: 40px; line-height: 40px; padding: 0px;}
  .popover-options li a { color: #888; text-decoration: none; }
  .popover-options li a .popover-icon { width: 50px; margin-right: 10px; color: #303133; }
</style>
