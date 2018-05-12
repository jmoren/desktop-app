<template>
  <div class="ticket-search">
    <el-autocomplete
      :fetch-suggestions="search"
      v-model="criteria" 
      :trigger-on-focus="false"
      class="autocomplete"
      style="width: 100%"
      placeholder="Buscar ticket"
      @select="gotToTicket">
      <i 
        slot="prefix" 
        class="el-input__icon el-icon-search"></i>
      <template slot-scope="{ item }">
        <div class="value">Nro: {{ item.number }}</div>
        <div class="link">Cliente: {{ item.client.id ? item.client.name : '----' }}</div>
        <div class="link">Mesa: {{ item.table.id ? item.table.description : 'Delivery' }}</div>
      </template>
    </el-autocomplete>
  </div>
</template>

<script>
import { createNamespacedHelpers as namespace } from "vuex";
const { mapActions: ticketActions } = namespace("tickets");

export default {
  name: "SearchForm",
  data() {
    return {
      criteria: "",
      tickets: []
    };
  },
  methods: {
    ...ticketActions(["searchTicket"]),
    search(query, cb) {
      if (this.criteria && this.criteria.length > 1) {
        this.searchTicket(this.criteria)
          .then(response => {
            cb(response);
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    gotToTicket(ticket) {
      this.criteria = "";
      this.$router.push({ name: "ticket", params: { id: ticket.id } });
    }
  }
};
</script>

<style scoped>
.ticket-search {
  /*position: absolute;
    box-shadow: 3px 3px 3px #999;
    top: 4.6em;
    left: 0;
    z-index: 1000;
    background: #f1f1f1;
    padding: 10px;*/
  width: 100%;
  height: 3em;
  line-height: 3em;
}
.el-autocomplete-suggestion li {
  padding: 7px 2px !important;
}
.el-scrollbar .value {
  text-overflow: ellipsis;
  overflow: hidden;
  color: #333;
}
.el-scrollbar .link {
  font-size: 12px;
  color: #888;
  margin: 3px 0px;
  line-height: 15px;
  height: 15px;
}
</style>
