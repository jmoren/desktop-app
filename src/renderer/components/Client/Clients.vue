<template>
  <div class="main-content-view">
    <page-header>
      <div slot="title" >Clientes</div>
      <div slot="controls">
        <el-button type="info" :loading="loading" @click="reloadClients()">Recargar</el-button>
      </div>
    </page-header>
    <page-content>
      <div slot="content" v-loading="loading">
        <el-row :gutter="20">
          <el-col :span="18">
            <el-table :data="filteredClients" style="width: 100%">
              <el-table-column
                prop="name"
                label="Nombre Completo">
              </el-table-column>
              <el-table-column
                prop="phone"
                label="Telefono">
              </el-table-column>
              <el-table-column
                prop="total_debt"
                label="Deuda Pendiente">
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="6">
            <div class="clients-table">
              <el-input type="search" v-model="filter" placeholder="Filtrar clientes"/>
            </div>
          </el-col>
        </el-row>
      </div>
    </page-content>
  </div>
</template>

<script>
  import PageHeader from '@/components/Shared/PageHeader'
  import PageContent from '@/components/Shared/PageContent'
  import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
  import { createNamespacedHelpers as namespace } from 'vuex'
  const { mapGetters: clientsGetters, mapActions: clientsActions } = namespace('clients')

  export default {
    name: 'clients',
    components: { PageHeader, PageContent, FontAwesomeIcon },
    data () {
      return {
        loading: false,
        filter: ''
      }
    },
    computed: {
      ...clientsGetters(['clientList']),
      filteredClients () {
        if (this.filter) {
          return this.clientList.filter((c) => {
            return c.name.toLowerCase().match(this.filter)
          })
        } else {
          return this.clientList
        }
      }
    },
    methods: {
      ...clientsActions(['fetchClients']),
      reloadClients () {
        this.loading = true
        this.fetchClients().then(response => {
          console.log(response)
          this.loading = false
        })
      }
    }
  }
</script>

<style>
  .clients-table { padding: 10px 10px 10px 0px; }
</style>
