<template lang="html">
  <div class="main-content-view">
    <div class="main-nav-bar">
      <span class="title">MESAS</span>
      <div style="float: right">
        <el-button-group>
          <el-button type="primary" @click="filterTables('open')">Abiertas</el-button>
          <el-button type="primary" @click="filterTables('closed')">Cerradas</el-button>
          <el-button type="primary" @click="filterTables('')">Todas</el-button>
        </el-button-group>
        <el-button type="info" :loading="loading" @click="reloadTables()">Recargar</el-button>
      </div>
    </div>
    <div class="content">
      <div class="table-list" v-loading="loading">
        <el-row>
          <el-col :span="4" v-for="(table, index) in tables" :key="index" class="table">
            <el-card shadow="never" style="border-radius: 0px;border-top: none; border-left: none;">
              <div :class="table.status">
                <span class="icon"><font-awesome-icon icon="utensils" size="2x"></font-awesome-icon></span>
                <div class="name">{{ table.description }}</div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import { createNamespacedHelpers as namespace } from 'vuex'
const { mapGetters: tablesGetters, mapActions: tablesActions } = namespace('tables')

export default {
  name: 'tables',
  components: { FontAwesomeIcon },
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
.main-content-view {
  padding: 0px;
  margin: 0px;
}
  .main-nav-bar {
    background: #f1f1f1;
    padding: 10px;
    margin: 0px;
    height: 50px;
    line-height: 50px;
    border-bottom: solid 1px #d4d4d4;
  }
  .main-nav-bar .title {
    color: #333;
    font-weight: bold;
    font-size: 25px;
  }
  .table-list {
    overflow: scroll;
    height: 850px;
    padding: 0px;
    margin: 0px;
  }
  .table-list .table .closed {
    color: #C70039;
  }

  .table-list .table .open {
    color: #333;
  }

  .table-list .table {
    text-align: center;
  }
  .table-list .table .name {
    margin: 5px 0px;
    padding: 0px;
  }

</style>
