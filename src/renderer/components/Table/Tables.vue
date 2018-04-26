<template lang="html">
  <div class="main-content-view">
    <page-header>
      <div slot="title" >MESAS</div>
      <div slot="controls">
        <el-button-group>
          <el-button type="primary" @click="filterTables('open')">Abiertas</el-button>
          <el-button type="primary" @click="filterTables('closed')">Cerradas</el-button>
          <el-button type="primary" @click="filterTables('')">Todas</el-button>
        </el-button-group>
        <el-button type="info" :loading="loading" @click="reloadTables()">Recargar</el-button>
      </div>
    </page-header>
    <page-content>
      <div slot="content">
        <div class="tables-content" v-loading="loading">
          <el-row>
            <el-col :span="4" v-for="(table, index) in tables" :key="index" class="table">
              <el-card shadow="never" style="border-radius: 0px;border-top: none; border-left: none; height: 129px;">
                <div :class="table.status">
                  <el-row :gutter="5" >
                    <el-col :span="8">
                      <span v-if="table.current.id">
                        <router-link :to="{ name: 'ticket', params: { id: table.current.id }}">
                          <span class="icon"><font-awesome-icon icon="utensils" size="4x"></font-awesome-icon></span>
                        </router-link>
                      </span>
                      <span v-else>
                        <a @click="openTable(table)">
                          <span class="icon"><font-awesome-icon icon="utensils" size="4x"></font-awesome-icon></span>
                        </a>
                      </span>
                    </el-col>
                    <el-col :span="16" class="with-ticket" v-if="table.current.id">
                      <el-row :gutter="5">
                        <div style="font-size: 13px">
                          <i class="el-icon-bell"></i> 
                          Ticket <b>{{ table.current.number }}</b>
                        </div>
                        <div style="font-size: 13px; margin-top: 5px" v-if="table.current.client.name">
                          <i class="el-icon-circle-check"></i> 
                          {{ table.current.client.name }}
                        </div>
                        <div style="font-size: 13px; margin-top: 5px">
                          <a href=""><i class="el-icon-circle-close-outline"></i> Cerrar</a>
                        </div>
                      </el-row>
                    </el-col>
                  </el-row>
                  <el-row :gutter="5" style="margin-top: 10px;">
                    <el-col :span="24"><div class="name">{{ table.description }}</div></el-col>
                  </el-row>
                </div>
              </el-card>
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
const { mapGetters: tablesGetters, mapActions: tablesActions } = namespace('tables')

export default {
  name: 'tables',
  components: { PageHeader, PageContent, FontAwesomeIcon },
  data () {
    return {
      loading: false,
      tableStatus: ''
    }
  },
  computed: {
    ...tablesGetters(['tableList']),
    tables () {
      if (this.tableStatus) {
        return this.tableList.filter((table) => table.status === this.tableStatus)
      } else {
        return this.tableList
      }
    }
  },
  methods: {
    ...tablesActions(['fetchTables']),
    filterTables (status) {
      this.tableStatus = status
    },
    reloadTables () {
      this.loading = true
      this.fetchTables().then(response => {
        this.loading = false
      }).catch(error => {
        this.$notify({
          type: 'error',
          title: 'Error cargando mesas',
          message: error.data.message,
          position: 'bottom-right'
        })
        this.loading = false
      })
    },
    openTable (table) {
      console.log(table)
    }
  }
}
</script>

<style lang="css">
  .tables-content .table .closed,
  .tables-content .table .closed a {
    color: #C70039;
  }

  .tables-content .table .open,
  .tables-content .table .open a {
    color: #333;
  }

  .tables-content .table {
    text-align: left;
    min-height: 130px;
    max-height: 130px;
  }
  .tables-content .table .with-ticket a { color: #C70039; text-decoration: none;}
  .tables-content .table .name {
    margin: 5px 0px;
    padding: 0px;
  }

</style>
