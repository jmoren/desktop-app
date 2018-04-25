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
        <el-row :gutter="10" class="ticket-top">
          <el-col :span="18">
            <ticket-item-form></ticket-item-form>
          </el-col>
          <el-col :span="6">
            <div class="ticket-total">${{ ticket.partial_total }}</div>
          </el-col>
        </el-row>
        <el-row :gutter="10" class="ticket-middle">
          <el-col :span="18">
            {{ ticket }}
            <ticket-items></ticket-items>
          </el-col>
          <el-col :span="6">
            <ticket-payments></ticket-payments>
          </el-col>
        </el-row>
      </div>
    </page-content>
  </div>
</template>

<script>
  import { ipcRenderer } from 'electron'
  import PageHeader from '@/components/Shared/PageHeader'
  import PageContent from '@/components/Shared/PageContent'
  import FontAwesomeIcon from '@fortawesome/vue-fontawesome'

  import TicketPayments from '@/components/Ticket/TicketContent/TicketPayments'
  import TicketItems from '@/components/Ticket/TicketContent/TicketItems'
  import TicketItemForm from '@/components/Ticket/TicketContent/TicketItemForm'

  import { createNamespacedHelpers as namespace } from 'vuex'
  const { mapActions: ticketsActions } = namespace('tickets')
  const { mapGetters: productsGetters } = namespace('shared')

  export default {
    name: 'client',
    components: {
      PageContent,
      PageHeader,
      FontAwesomeIcon,
      TicketPayments,
      TicketItems,
      TicketItemForm
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
  .ticket-top {
    height: 100px;
    line-height: 90px;
    position: fixed;
    top: 70px;
    width: 100%;
    z-index: 999;
    background: #fff;
    padding: 0px 10px;
    margin-left: 0px !important;
    margin-right: 0px !important;
  }
  .ticket-middle {
    height: 100vh;
    overflow: scroll;
    margin-top: 100px;
    padding: 10px;
    background: #f1f1f1;
  }
  .ticket-top .ticket-total {
    font-size: 60px;
    text-align: center;
    border-left: solid 1px #ddd;
    height: 100px;
  }
  .ticket-top .ticket-form {
    text-align: left;
    height: 100px;
  }
</style>
