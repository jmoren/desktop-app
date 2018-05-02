<template>
  <div class="main-content-view">
    <page-header>
      <div slot="title" >Clientes</div>
      <div slot="controls">
        <a class="reload" @click="reloadClients()">
          <font-awesome-icon icon="sync"></font-awesome-icon>
        </a>
      </div>
    </page-header>
    <page-content>
      <div slot="content">
        <div class="clients-content" v-loading="loading">
          <el-row :gutter="0" style="margin: 5px 0px">
            <el-col :span="12">
              <el-input type="search" v-model="filter" placeholder="Filtrar clientes">
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
              </el-input>
            </el-col>
          </el-row>
          <el-row :gutter="0">
            <el-col :span="24">
              <el-table :data="filteredClients" style="width: 100%" max-height="780">
                <el-table-column
                  sortable
                  prop="name"
                  label="Nombre Completo">
                  <template slot-scope="scope">
                    <router-link :to="{ name: 'client', params: { id: scope.row.id } }">
                      {{ scope.row.name }}
                    </router-link>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="phone"
                  label="Telefono">
                </el-table-column>
                <el-table-column
                  prop="address"
                  label="Direccion">
                </el-table-column>
                <el-table-column
                  prop="total_debt"
                  sortable
                  label="Deuda Pendiente"
                  width="180">
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </div>
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
  .clients-content { padding: 0px 10px; background: #fff;}
</style>
