<template lang="html">
  <div class="main-content-view">
    <div class="main-nav-bar">
      <span class="title">Mesas</span>
      <div style="float: right">
        <el-button :loading="loading" icon="el-icon-refresh" @click="reloadTables()" circle></el-button>
      </div>
    </div>
    <div class="content">
      <div class="table-list" v-loading="loading">
        <ul>
          <li v-for="(table, index) in tableList" :key="index">
            {{ table }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers as namespace } from 'vuex'
const { mapGetters: tablesGetters, mapActions: tablesActions } = namespace('tables')
export default {
  name: 'tables',
  data () {
    return {
      loading: false
    }
  },
  computed: {
    ...tablesGetters(['tableList'])
  },
  methods: {
    ...tablesActions(['fetchTables']),
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
    color: #333;
    padding: 10px;
    margin: 0px;
    height: 50px;
    line-height: 50px;
    border-bottom: solid 1px #ddd;
  }
  .main-nav-bar .title {
    color: #333;
    font-weight: bold;
    font-size: 20px;
  }
  .table-list {
    overflow: scroll;
    height: 850px;
    padding: 0px;
    margin: 0px;
  }
</style>
