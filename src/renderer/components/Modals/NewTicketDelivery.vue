<template>
  <el-dialog 
    :close-on-click-modal="false" 
    :before-close="closeModal" 
    :visible="modalOpen" 
    title="Nuevo Ticket Delivery">
    <el-form 
      ref="form" 
      :model="newTicket" 
      label-width="120px">
      <el-form-item label="Cliente">
        <el-autocomplete
          :fetch-suggestions="search" 
          v-model="newTicket.client.name"
          :trigger-on-focus="false"
          style="width: 100%"
          placeholder="Buscar cliente"
          @select="setClient">
          <i 
            slot="prefix" 
            class="el-input__icon el-icon-search"></i>
          <template slot-scope="{ item }">
            <div class="value">{{ item.name }}</div>
            <div class="link">{{ item.address }} - {{ item.phone }}</div>
          </template>
        </el-autocomplete>
      </el-form-item>
      <el-form-item label="Direccion">
        <el-input 
          v-model="newTicket.address" 
          placeholder="Direccion"/>
      </el-form-item>
      <el-form-item>
        <el-button 
          type="primary" 
          @click="addTable()">Guardar</el-button>
        <el-button 
          type="default" 
          @click="closeModal()">Cancelar</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { createNamespacedHelpers as namespace } from "vuex";
const { mapActions: clientsActions } = namespace("clients");
const { mapActions: ticketsActions } = namespace("tickets");

export default {
  name: "NewTicketDelivery",
  data() {
    return {
      modalOpen: false,
      newTicket: {
        client: {},
        address: ""
      }
    };
  },
  created() {
    this.openModal();
  },
  methods: {
    ...ticketsActions(["createDelivery"]),
    ...clientsActions(["searchClient"]),
    addTable() {
      let params = {
        client_id: this.newTicket.client.id,
        address: this.newTicket.address
      };
      this.createDelivery(params)
        .then(response => {
          console.log(response);
          this.$router.push({ name: "ticket", params: { id: response.id } });
          this.closeModal();
        })
        .catch(error => {
          console.log(error);
        });
    },
    search(query, cb) {
      this.searchClient(query)
        .then(response => {
          cb(response.data);
        })
        .catch(error => {
          console.log(error);
        });
    },
    setClient(client) {
      this.newTicket.client = client;
    },
    openModal() {
      this.modalOpen = true;
    },
    closeModal() {
      this.modalOpen = false;
      this.$emit("done");
    }
  }
};
</script>

<style scoped>
.el-autocomplete-suggestion .value {
  text-overflow: ellipsis;
  overflow: hidden;
}
.el-autocomplete-suggestion .link {
  font-size: 12px !important;
  color: #888 !important;
}
</style>
