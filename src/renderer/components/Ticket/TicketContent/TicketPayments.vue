<template>
  <div class="ticket-payments-content" v-loading="loading">
    <div class="payments-toolbar">
      <div class="reload-data">
        <el-button size="mini" type="primary" @click="loadPayments()">
          <font-awesome-icon icon="sync"></font-awesome-icon>
          Reload
        </el-button>
      </div>
      <div class="toolbar">
        <el-button-group>
          <el-button size="mini" type="danger">
            <font-awesome-icon icon="trash"></font-awesome-icon>
            Eliminar pagos
          </el-button>
        </el-button-group>
      </div>
    </div>
    <p>{{ payments }}</p>
  </div>
</template>

<script>
  import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
  import { createNamespacedHelpers as namespace } from 'vuex'
  const { mapGetters: ticketGetters, mapActions: ticketActions } = namespace('tickets')

  export default {
    name: 'ticket-payments',
    components: { FontAwesomeIcon },
    data () {
      return {
        loading: false
      }
    },
    computed: {
      ...ticketGetters(['ticket', 'payments'])
    },
    created () {
      this.loadPayments()
    },
    methods: {
      ...ticketActions(['fetchTicketPayments']),
      loadPayments () {
        this.fetchTicketPayments(this.ticket.id).then(response => {
          this.loading = false
        }).catch(error => {
          console.log(error)
          this.loading = false
        })
      }
    }
  }
</script>

<style>
  .ticket-payments-content {
    min-height: 740px;
  }
  .ticket-payments .payments-toolbar {
    height: 3em;
    line-height: 3em;
    border-bottom: solid 1px #eee;
    padding: 0px;
  }
  .ticket-payments .payments-toolbar .reload-data {
    float: left;
  }
  .ticket-payments .payments-toolbar .toolbar {
    float: right;
  }
</style>
