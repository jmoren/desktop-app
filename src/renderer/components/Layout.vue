<template lang="html">
  <div class="panels">
    <div class="left-panel">
      <el-popover
        placement="right-start"
        width="250"
        trigger="click">
        <div class="popover-title">Mesas</div>
        <ul class="popover-options">
          <li>
            <router-link :to="{ name: 'tables' }">
              <span class="popover-icon"><icon icon="clipboard"/></span>
              Mesas
            </router-link>
          </li>
          <li>
            <a @click="openModal('open-table')">
              <span class="popover-icon"><icon icon="unlock"/></span>
              Abrir Mesa
            </a>
          </li>
          <li>
            <a @click="openModal('new-table')">
              <span class="popover-icon"><icon icon="plus"/></span>
              Nueva Mesa
            </a>
          </li>
          <li><a href="#"><span class="popover-icon"><icon icon="search"/></span> Ver Mapa</a></li>
        </ul>
        <div
          slot="reference"
          class="left-panel-option">
          <icon icon="utensils"/>
        </div>
      </el-popover>
      <el-popover
        placement="right-start"
        width="250"
        trigger="click">
        <div class="popover-title">Tickets</div>
        <ul class="popover-options">
          <li class="no-border">
            <ticket-search ref="searchForm"/>
          </li>
          <li>
            <a @click="openModal('new-ticket-delivery')">
              <span class="popover-icon"><icon icon="plus"/></span>
              Ticket Delivery
            </a>
          </li>
          <li><a href="#"><span class="popover-icon"><icon icon="clipboard"/></span> Tickets Abiertos</a></li>
          <li><a href="#"><span class="popover-icon"><icon icon="search"/></span> Todos los tickets</a></li>
        </ul>
        <div
          slot="reference"
          class="left-panel-option" >
          <icon icon="sticky-note"/>
        </div>
      </el-popover>
      <el-popover
        placement="right-start"
        width="250"
        trigger="click">
        <div class="popover-title">Deliveries</div>
        <ul class="popover-options">
          <li><a href="#"><span class="popover-icon"><icon icon="clipboard"/></span> Tickets Sin enviar</a></li>
          <li><a href="#"><span class="popover-icon"><icon icon="plus"/></span> Crear Delivery</a></li>
          <li><a href="#"><span class="popover-icon"><icon icon="search"/></span> Entregados</a></li>
        </ul>
        <div
          slot="reference"
          class="left-panel-option">
          <icon icon="truck"/>
        </div>
      </el-popover>
      <el-popover
        :visible-arrow="false"
        placement="right-start"
        width="250"
        trigger="click">
        <div class="popover-title">Clientes</div>
        <ul class="popover-options">
          <li class="no-border">
            <client-search/>
          </li>
          <li>
            <router-link :to="{ name: 'clients' }">
              <span class="popover-icon"><icon icon="users"/></span>
              Clientes
            </router-link>
          </li>
          <li>
            <a @click="openModal('new-client')">
              <span class="popover-icon"><icon icon="plus"/></span>
              Nuevo Cliente
            </a>
          </li>
        </ul>
        <div
          slot="reference"
          class="left-panel-option">
          <icon icon="users"/>
        </div>
      </el-popover>
      <div class="left-panel-option">
        <el-tooltip
          effect="dark"
          placement="right"
          content="Administracion">
          <icon icon="cog"/>
        </el-tooltip>
      </div>
      <div class="left-panel-option">
        <el-tooltip
          effect="dark"
          placement="right"
          content="Salir">
          <icon icon="sign-out-alt"/>
        </el-tooltip>
      </div>
    </div>
    <div class="right-panel">
      <router-view/>
    </div>
    <div v-if="currentComponent">
      <component
        :is="currentComponent"
        @done="removeComponent()"/>
    </div>
  </div>
</template>

<script>
import Icon from "@fortawesome/vue-fontawesome";
import ClientSearch from "@/components/Shared/ClientSearch";
import TicketSearch from "@/components/Shared/TicketSearch";
import { createNamespacedHelpers as namespace } from "vuex";

const { mapActions: authActions } = namespace("auth");
const { mapActions: tablesActions } = namespace("tables");
const { mapActions: productsActions } = namespace("products");
const { mapActions: clientsActions } = namespace("clients");
const { mapActions: categoriesActions } = namespace("categories");

require("@/components/Modals");

export default {
  name: "Layout",
  components: { Icon, ClientSearch, TicketSearch },
  data() {
    return {
      loadTablesOk: false,
      loadClientsOk: false,
      loadProductsOk: false,
      loadCategoriesOk: false,
      modalOpen: false,
      currentComponent: "",
      currentTitle: ""
    };
  },
  computed: {
    dataReady() {
      return this.loadTablesOk && this.loadClientsOk && this.loadProductsOk;
    }
  },
  created() {
    this.loadData();
  },
  methods: {
    ...authActions(["logout"]),
    ...tablesActions(["fetchTables"]),
    ...clientsActions(["fetchClients"]),
    ...productsActions(["fetchProducts"]),
    ...categoriesActions(["fetchCategories"]),
    doLogout() {
      this.logout().then(() => {
        this.$router.push({ name: "Login" });
      });
    },
    openModal(component) {
      this.currentComponent = component;
    },
    removeComponent() {
      console.log("remove component");
      this.currentComponent = "";
    },
    loadData() {
      this.fetchTables()
        .then(() => {
          this.loadTablesOk = true;
        })
        .catch(error => {
          console.log(error);
        });
      this.fetchClients()
        .then(() => {
          this.loadClientsOk = true;
        })
        .catch(error => {
          console.log(error);
        });
      this.fetchCategories()
        .then(() => {
          this.loadCategoriesOk = true;
        })
        .catch(error => {
          console.log(error);
        });
      this.fetchProducts()
        .then(() => {
          this.loadProductsOk = true;
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>

<style lang="css">
  .panels { height: 100vh; padding: 0px; margin: 0px; background: #fff; }
  .panels .left-panel { padding-top: 4.5em; text-align: center; color: #333; width: 70px;
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
  .panels .right-panel { padding-left: 70px; height: 100vh; background: #fff; }

  .popover-title { color: #606266; border-bottom: solid 1px #C0C4CC; padding-bottom: 5px; margin-bottom: 10px; }
  .popover-options { margin: 0px; padding: 0px; list-style: none; }
  .popover-options li { height: 40px; line-height: 40px; padding: 0px;}
  .popover-options li a { color: #888; text-decoration: none; }
  .popover-options li a .popover-icon { width: 50px; margin-right: 10px; color: #303133; }
</style>
