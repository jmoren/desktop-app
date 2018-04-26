<template>
  <div v-loading="loading">
    <p>{{ payments }}</p>
    <el-button type="primary" @click="loadPayments()">Reload</el-button>
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
  .ticket-middle .ticket-payments {
    border-left: solid 1px #ddd;
    overflow: auto;
    height: 100vh;
  }
</style>
