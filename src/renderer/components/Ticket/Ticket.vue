<template>
  <div v-loading="loading">
    <page-header>
      <div slot="title" >Ticket {{ ticket.number }}</div>
      <div slot="controls">
        <el-button-group>
          <el-button type="primary">Nuevo Pago</el-button>
        </el-button-group>
        <el-button type="info" :loading="loading" @click="reloadTables()">
          <i class="el-icon-refresh"></i>
        </el-button>
      </div>
    </page-header>
    <page-content>
      <div slot="content">
        {{ ticket }}
      </div>
    </page-content>
  </div>
</template>

<script>
  import { ipcRenderer } from 'electron'
  import PageHeader from '@/components/Shared/PageHeader'
  import PageContent from '@/components/Shared/PageContent'
  import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
  import { createNamespacedHelpers as namespace } from 'vuex'
  const { mapActions: ticketsActions } = namespace('tickets')
  const { mapGetters: productsGetters } = namespace('shared')

  export default {
    name: 'client',
    components: {
      PageContent,
      PageHeader,
      FontAwesomeIcon
    },
    data () {
      return {
        loading: false,
        ticket: {}
      }
    },
    computed: {
      ...productsGetters(['productList', 'categoryList'])
    },
    beforeDestroy () {
      ipcRenderer.send('toggle-ticket-menu', {})
      ipcRenderer.removeAllListeners('ticket-action')
    },
    mounted () {
      ipcRenderer.send('toggle-ticket-menu', {})

      ipcRenderer.on('ticket-action', (event, action) => {
        console.log(action)
      })
    },
    created () {
      this.loadTicket()
    },
    methods: {
      ...ticketsActions(['fetchTicket']),
      loadTicket () {
        this.loading = true
        this.fetchTicket(this.$route.params.id).then(response => {
          this.ticket = response
          this.loading = false
        })
      }
    }
  }
</script>

<style>
  
</style>
