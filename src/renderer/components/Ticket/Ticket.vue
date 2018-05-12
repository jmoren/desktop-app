<template>
  <div 
    v-loading="loading" 
    class="main-content-view">
    <page-header>
      <div slot="title" >Ticket {{ ticket.number }}</div>
      <div slot="sub-items">
        <ul class="ticket-information">
          <el-tooltip 
            effect="dark" 
            content="Mesa asignada del ticket" 
            placement="bottom">
            <li :class="{'no-data': !ticketTable && !loading }">
              {{ ticketTable || 'Delivery' }}
            </li>
          </el-tooltip>
          <el-tooltip 
            effect="dark" 
            content="Cliente asignado al ticket" 
            placement="bottom">
            <li :class="{'no-data': !ticketClient && !loading }">
              {{ ticketClient || 'Sin Cliente' }}
            </li>
          </el-tooltip>
          <li>
            <span :class="loading ? 'no-data' : ticket.status">
              <font-awesome-icon icon="circle"/>
            </span>
            {{ loading ? '----' : ticketStatus }}
          </li>
        </ul>
      </div>
      <div slot="controls">
        <a 
          class="reload" 
          @click="loadTicket()">
          <font-awesome-icon icon="sync-alt"/>
        </a>
      </div>
    </page-header>
    <page-content>
      <div 
        v-loading="loading" 
        slot="content" 
        class="ticket-content">
        <div class="ticket-top">
          <el-row :gutter="0">
            <el-col 
              :span="18" 
              class="top-left">
              <el-row :gutter="15">
                <el-col :span="2">
                  <el-tooltip 
                    :content="isModal ? 'Cambiar a formulario en la pagina' : 'Cambiar a formulario fullscreen'" 
                    effect="dark"
                    placement="bottom-start">
                    <el-button 
                      plain 
                      @click="toggleMode()">
                      <span style="float: left">
                        <font-awesome-icon :icon="isModal ? 'keyboard' : 'hand-paper'"/>
                      </span>
                    </el-button>
                  </el-tooltip>
                </el-col>
                <el-col :span="7">
                  <el-button 
                    style="width: 100%" 
                    type="primary" 
                    @click="openFormModal('item')">Item</el-button>
                </el-col>
                <el-col :span="7">
                  <el-button 
                    style="width: 100%" 
                    type="primary" 
                    @click="openFormModal('promotion')">Promocion</el-button>
                </el-col>
                <el-col :span="7">
                  <el-button 
                    style="width: 100%" 
                    type="primary" 
                    @click="openFormModal('additional')">Adicional</el-button>
                </el-col>
              </el-row>
            </el-col>
            <el-col 
              :span="6" 
              class="top-right">
              <span class="ticket-total">{{ ticket.partial_total | currency }}</span>
            </el-col>
          </el-row>
        </div>
        <div class="ticket-middle">
          <el-row :gutter="0">
            <el-col 
              :span="showPayments ? 18 : 24" 
              style="position: relative">
              <ticket-entries 
                v-if="ticket.id" 
                ref="entries" 
                :is-modal="isModal"/>
            </el-col>
            <el-col 
              :span="6" 
              :class="{'panel-open': showPayments, 'panel-closed': !showPayments}">
              <ticket-payments 
                v-if="ticket.id" 
                ref="payments"/>
            </el-col>
          </el-row>
        </div>
        <div class="payment-button">
          <el-button 
            :icon="showPayments ? 'el-icon-arrow-right' : 'el-icon-arrow-left'" 
            type="primary" 
            circle 
            @click="togglePanel()"/>
        </div>
        <div class="ticket-modal-forms">
          <item-form-fullscreen ref="itemFormFullscreen"/>
          <promo-form-fullscreen ref="promoFormFullscreen"/>
        </div>
      </div>
    </page-content>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
import PageHeader from "@/components/Shared/PageHeader";
import PageContent from "@/components/Shared/PageContent";
import FontAwesomeIcon from "@fortawesome/vue-fontawesome";
import TicketPayments from "@/components/Ticket/TicketContent/TicketPayments";
import TicketEntries from "@/components/Ticket/TicketContent/TicketEntries";
import ItemFormFullscreen from "@/components/Ticket/TicketContent/Fullscreen/TicketItemForm";
import PromoFormFullscreen from "@/components/Ticket/TicketContent/Fullscreen/TicketPromoForm";

import { createNamespacedHelpers as namespace } from "vuex";
const { mapGetters: ticketGetters, mapActions: ticketActions } = namespace(
  "tickets"
);

export default {
  name: "Client",
  components: {
    PageContent,
    PageHeader,
    FontAwesomeIcon,
    TicketPayments,
    TicketEntries,
    ItemFormFullscreen,
    PromoFormFullscreen
  },
  data() {
    return {
      loading: false,
      showPayments: true,
      isModal: true
    };
  },
  computed: {
    ...ticketGetters(["ticket"]),
    ticketStatus() {
      if (this.ticket.status === "open") {
        return "Abierto";
      } else if (this.ticket.status === "closed") {
        return "Cerrado";
      } else {
        return "Error";
      }
    },
    ticketTable() {
      if (!this.ticket.table) {
        return "";
      } else {
        return this.ticket.table.id ? this.ticket.table.description : "";
      }
    },
    ticketClient() {
      if (!this.ticket.client) {
        return "";
      } else {
        return this.ticket.client.id ? this.ticket.client.name : "";
      }
    }
  },
  beforeDestroy() {
    ipcRenderer.send("toggle-ticket-menu", {});
    ipcRenderer.removeAllListeners("ticket-action");
    this.unloadData();
  },
  mounted() {
    ipcRenderer.send("toggle-ticket-menu", {});

    ipcRenderer.on("ticket-action", (event, action) => {
      console.log(action);
    });
  },
  created() {
    this.loadTicket();
  },
  methods: {
    ...ticketActions([
      "fetchTicket",
      "fetchTicketEntries",
      "fetchTicketPayments",
      "cleanStore"
    ]),
    loadTicket() {
      this.loading = true;
      this.fetchTicket(this.$route.params.id)
        .then(response => {
          this.loading = false;
        })
        .catch(error => {
          console.log(error);
          this.loading = false;
        });
    },
    togglePanel() {
      this.showPayments = !this.showPayments;
    },
    unloadData() {
      this.cleanStore();
    },
    openFormModal(type) {
      if (this.isModal) {
        if (type === "item") {
          this.$refs.itemFormFullscreen.open();
        } else if (type === "promotion") {
          this.$refs.promoFormFullscreen.open();
        } else if (type === "additional") {
          this.$refs.entries.switchForm(type);
        }
      } else {
        this.$refs.entries.switchForm(type);
      }
    },
    toggleMode() {
      this.isModal = !this.isModal;
    }
  }
};
</script>

<style>
.main-content-view,
.ticket-content,
.ticket-middle {
  min-height: 100%;
}

.ticket-top {
  top: 4.5em;
  height: 5em;
  line-height: 5em;
  background: #fff;
  border-bottom: solid 2px #ddd;
}

.ticket-top .top-left {
  padding-left: 10px;
  padding-right: 10px;
}

.ticket-top .top-right {
  border-left: solid 1px #ddd;
  padding-left: 10px;
}

.ticket-top .ticket-total {
  font-size: 60px;
}

.ticket-middle {
  padding: 0em;
  background: #fff;
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

.panel-open {
  display: block;
}
.panel-closed {
  display: none;
}
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

.ticket-information li.no-data {
  color: #999 !important;
}
.ticket-information li.delivery {
  color: #f56c6c !important;
}
.ticket-information .open {
  color: #67c23a !important;
}
.ticket-information .closed {
  color: #f56c6c !important;
}
.ticket-information .no-data {
  color: #999 !important;
}

.ticket-content .ticket-modal-forms .el-dialog__header {
  padding: 20px;
}
.ticket-content .ticket-modal-forms .el-dialog__header .el-dialog__title {
  font-size: 40px;
  line-height: 50px;
  height: 50px;
}
.ticket-content .ticket-modal-forms .el-dialog__header .el-dialog__headerbtn {
  font-size: 40px;
}
</style>
