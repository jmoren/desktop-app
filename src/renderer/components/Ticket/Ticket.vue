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
        <div class="ticket-top">
          <el-row :gutter="0">
            <el-col :span="18" class="top-left">
              <el-row :gutter="15">
                <el-col :span="2">
                  <el-button plain @click="toggleMode()">
                    <span style="float: left">
                      <font-awesome-icon :icon="isModal ? 'hand-pointer' : 'keyboard'"></font-awesome-icon>
                    </span>
                  </el-button>
                </el-col>
                <el-col :span="7">
                  <el-button @click="openFormModal('item')" style="width: 100%" type="primary">Item</el-button>
                </el-col>
                <el-col :span="7">
                  <el-button @click="openFormModal('item')" style="width: 100%" type="primary">Promocion</el-button>
                </el-col>
                <el-col :span="7">
                  <el-button @click="openFormModal('item')" style="width: 100%" type="primary">Adicional</el-button>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="6" class="top-right">
              <span class="ticket-total">{{ ticket.partial_total | currency }}</span>
            </el-col>
          </el-row>
        </div>
        <div class="ticket-middle">
          <el-row :gutter="0">
            <el-col :span="showPayments ? 18 : 24" style="position: relative">
              <ticket-entries ref="entries" :is-modal="isModal" v-if="ticket.id"></ticket-entries>
            </el-col>
            <el-col :span="6" :class="{'panel-open': showPayments, 'panel-closed': !showPayments}">
              <ticket-payments ref="payments" v-if="ticket.id"></ticket-payments>
            </el-col>
          </el-row>
        </div>
        <div class="payment-button">
          <el-button type="primary" @click="togglePanel()" 
            :icon="showPayments ? 'el-icon-arrow-right' : 'el-icon-arrow-left'" circle></el-button>
        </div>
        <div class="ticket-modal-forms">
          <modal-ticket-item-form ref="itemFormModal"></modal-ticket-item-form>
        </div>
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
  import ModalTicketItemForm from '@/components/Ticket/TicketContent/ModalTicketItemForm'

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
      ModalTicketItemForm
    },
    data () {
      return {
        loading: false,
        showPayments: true,
        isModal: true
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
      togglePanel () {
        this.showPayments = !this.showPayments
      },
      unloadData () {
        this.cleanStore()
      },
      openFormModal (type) {
        if (type === 'item') {
          this.$refs.itemFormModal.open()
        } else if (type === 'promocion') {
          console.log('promo')
        } else if (type === 'adicional') {
          console.log('adicional')
        }
      },
      toggleMode () {
        this.isModal = !this.isModal
      }
    }
  }
</script>

<style>
  .main-content-view, .ticket-content, .ticket-middle {
    min-height: 100%;
  }
  
  .ticket-top {
    position: fixed;
    top: 4.5em;
    height: 5em;
    line-height: 5em;
    width: 100%;
    background: #fff;
    margin-left: 0px !important;
    margin-right: 0px !important;
    border-bottom: solid 2px #ddd;
  }
  
  .ticket-top .top-left {
    width: 75%;
    padding-left: 10px;
    padding-right: 10px;
  }

  .ticket-top .top-right {
    border-left: solid 1px #ddd;
    padding-left: 10px;
    height: 5em;
    width: 25%;
  }
  
  .ticket-top .ticket-total {
    font-size: 60px;
  }

  .ticket-middle {
    padding: 5.1em 0em 1em;
    background: #fff;
    margin-left: 0px !important;
    margin-right: 0px !important;
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
  
  .panel-open { display: block; }
  .panel-closed { display: none; }
  .payment-button {
    position: fixed;
    top: 95px;
    right: 10px;
    text-align: center;
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

  .ticket-content .ticket-modal-forms .el-dialog__header { padding: 20px; }
  .ticket-content .ticket-modal-forms .el-dialog__header .el-dialog__title { font-size: 40px; line-height: 50px; height: 50px; }
  .ticket-content .ticket-modal-forms .el-dialog__header .el-dialog__headerbtn { font-size: 40px; }
</style>
