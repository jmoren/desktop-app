<template>
  <div v-loading="loading" class="main-content-view">
    <page-header>
      <div slot="title" >Ticket {{ ticket.number }}</div>
      <div slot="sub-items">
        <ul class="ticket-information">
          <li :class="{'no-data': !ticketTable && !loading }">{{ ticketTable || 'Delivery' }}</li>
          <li :class="{'no-data': !ticketClient && !loading }">{{ ticketClient || 'Sin Cliente' }}</li>
          <li>
            <span :class="loading ? 'no-data' : ticket.status">
              <font-awesome-icon icon="circle"></font-awesome-icon>
            </span>
            {{ loading ? '----' : ticketStatus }}
          </li>
        </ul>
      </div>
      <div slot="controls">
        <a class="reload" @click="loadTicket()">
          <font-awesome-icon icon="sync-alt"></font-awesome-icon>
        </a>
      </div>
    </page-header>
    <page-content>
      <div slot="content" class="ticket-content" v-loading="loading">
        <el-row :gutter="10" class="ticket-top">
          <el-col :span="18">
            <div v-if="ticket.id">
              <ticket-item-form></ticket-item-form>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="ticket-total">${{ ticket.partial_total }}</div>
          </el-col>
        </el-row>
        <el-row :gutter="10" class="ticket-middle">
          <el-col :span="18" class="ticket-rows">
            <ticket-entries v-if="ticket.id"></ticket-entries>
          </el-col>
          <el-col :span="6" class="ticket-payments">
            <ticket-payments v-if="ticket.id"></ticket-payments>
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
  import TicketEntries from '@/components/Ticket/TicketContent/TicketEntries'
  import TicketItemForm from '@/components/Ticket/TicketContent/TicketItemForm'
  import { createNamespacedHelpers as namespace } from 'vuex'
  const { mapGetters: ticketGetters, mapActions: ticketActions } = namespace('tickets')

  export default {
    name: 'client',
    components: {
      PageContent,
      PageHeader,
      FontAwesomeIcon,
      TicketPayments,
      TicketEntries,
      TicketItemForm
    },
    data () {
      return {
        loading: false
      }
    },
    computed: {
      ...ticketGetters(['ticket']),
      ticketStatus () {
        if (this.ticket.status === 'open') {
          return 'Abierto'
        } else if (this.ticket.status === 'closed') {
          return 'Cerrado'
        } else {
          return 'Error'
        }
      },
      ticketTable () {
        if (!this.ticket.table) {
          return ''
        } else {
          return this.ticket.table.id ? this.ticket.table.description : ''
        }
      },
      ticketClient () {
        if (!this.ticket.client) {
          return ''
        } else {
          return this.ticket.client.id ? this.ticket.client.name : ''
        }
      }
    },
    beforeDestroy () {
      ipcRenderer.send('toggle-ticket-menu', {})
      ipcRenderer.removeAllListeners('ticket-action')
      this.unloadData()
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
      ...ticketActions(['fetchTicket', 'fetchTicketEntries', 'fetchTicketPayments', 'cleanStore']),
      loadTicket () {
        this.loading = true
        this.fetchTicket(this.$route.params.id).then(response => {
          this.loading = false
        }).catch(error => {
          console.log(error)
          this.loading = false
        })
      },
      unloadData () {
        this.cleanStore()
      }
    }
  }
</script>

<style>
  .ticket-top {
    position: fixed;
    top: 4.5em;
    width: 100%;
    height: 5em;
    line-height: 5em;
    z-index: 999;
    background: #fff;
    padding: 0px 10px;
    margin-left: 0px !important;
    margin-right: 0px !important;
    box-shadow: 0px 2px 5px #999;
  }
  
  .ticket-top .ticket-total {
    font-size: 60px;
    text-align: center;
    border-left: solid 1px #ddd;
  }

  .ticket-top .ticket-form {
    text-align: left;
  }

  .ticket-middle {
    padding-top: 5em;
    min-height: 740px;
    background: #fff;
    margin-left: 0px !important;
    margin-right: 0px !important;
  }

  .ticket-middle .ticket-payments {
    border-left: solid 1px #ddd;
  }

  .ticket-information {
    margin: 0px;
    padding: 0px;
    list-style: none;
  }

  .ticket-information li {
    float: left;
    border-left: solid 1px #ddd;
    padding: 0px 20px;
    font-size: 25px;
  }

  .ticket-information li:first-child {
    border-left: solid 1px transparent; 
  }
  
  .reload {
    float: right;
    width: 50px;
    margin-right: 20px;
    font-size: 25px;
    text-align: center;
    cursor: pointer;
  }

  .ticket-information li.no-data { color: #999 !important; }
  .ticket-information li.delivery { color: #F56C6C !important; }
  .ticket-information .open { color: #67C23A !important; }
  .ticket-information .closed { color: #F56C6C !important; }
  .ticket-information .no-data { color: #999 !important; }
</style>
