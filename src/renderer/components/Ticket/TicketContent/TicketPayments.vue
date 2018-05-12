<template>
  <div class="ticket-payments-content">
    <div class="payment-form">
      <el-input 
        ref="newPayment" 
        :disabled="!isPending"
        v-model="newPayment.value" 
        placeholder="$ nuevo pago" 
        class="input-with-select" 
        clearable
        @blur="pay()"
        @keyup.enter="pay()">
        <el-select 
          slot="prepend" 
          v-model="newPayment.type" 
          :disabled="!isPending" 
          placeholder="Select">
          <el-option 
            label="Efectivo" 
            value="Efectivo"/>
          <el-option 
            label="Tarjeta" 
            value="Tarjeta"/>
        </el-select>
      </el-input>
    </div>
    <div 
      v-if="errorAmount" 
      class="error-message">
      <el-alert
        :title="errorAmount"
        type="error"
        show-icon
        close-text="Pendiente"
        @close="setPending"/>
    </div>
    <div 
      v-loading="loading" 
      class="ticket-table">
      <el-table 
        ref="paymentsTable"
        :data="payments"
        el-table
        style="width: 100%"
        height="585"
        @selection-change="handlePayments">
        <el-table-column
          type="selection"
          width="55"/>
        <el-table-column
          label="Tipo">
          <template slot-scope="scope">
            {{ scope.row.type }}
          </template>
        </el-table-column>
        <el-table-column
          label="Valor">
          <template slot-scope="scope">
            {{ scope.row.amount | currency }}
          </template>
        </el-table-column>
        <el-table-column
          label=""
          width="50">
          <template slot-scope="scope">
            <div style="text-align: center;">
              <a 
                href="#" 
                style="color: #F56C6C">
                <font-awesome-icon icon="trash"/>
              </a>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="payments-toolbar">
      <div class="reload-data">
        <el-button 
          size="mini" 
          type="primary" 
          @click="loadPayments()">
          <font-awesome-icon icon="sync"/>
        </el-button>
      </div>
      <div class="toolbar">
        <el-button-group v-if="selectedPayments.length > 0">
          <el-button 
            size="mini" 
            type="danger">
            <font-awesome-icon icon="trash"/>
            Eliminar pagos
          </el-button>
        </el-button-group>
      </div>
    </div>
    <div class="payments-toolbar">
      <div class="paid">Pagado: <span class="currency">{{ totalPaid | currency }}</span></div>
      <div class="pending">Pendinte: <span class="currency">{{ pendingValue | currency }}</span></div>
    </div>
  </div>
</template>

<script>
import FontAwesomeIcon from "@fortawesome/vue-fontawesome";
import { createNamespacedHelpers as namespace } from "vuex";
const { mapGetters: ticketGetters, mapActions: ticketActions } = namespace(
  "tickets"
);

export default {
  name: "TicketPayments",
  components: { FontAwesomeIcon },
  data() {
    return {
      loading: false,
      addingPayment: false,
      newPayment: {
        type: "Efectivo",
        value: ""
      },
      selectedPayments: []
    };
  },
  computed: {
    ...ticketGetters(["ticket", "payments"]),
    totalPaid() {
      return this.payments.reduce(function(total, payment) {
        return parseFloat(total) + parseFloat(payment.amount);
      }, 0.0);
    },
    pendingValue() {
      return parseFloat(this.ticket.partial_total) - parseFloat(this.totalPaid);
    },
    isPending() {
      return this.pendingValue > 0;
    },
    errorAmount() {
      if (!this.newPayment.value) {
        return "";
      } else if (!String(this.newPayment.value).match(/^\d+$/)) {
        return "El valor debe ser un numero";
      } else if (this.newPayment.value > this.pendingValue) {
        return "El valor debe ser menor o igual al pendiente";
      } else if (this.newPayment.value < 0) {
        return "El valor tiene que ser positivo";
      }
    }
  },
  created() {
    this.loadPayments();
  },
  methods: {
    ...ticketActions(["fetchTicketPayments", "addPayment"]),
    loadPayments() {
      this.loading = true;
      this.fetchTicketPayments(this.ticket.id)
        .then(response => {
          this.loading = false;
        })
        .catch(error => {
          console.log(error);
          this.loading = false;
        });
    },
    pay() {
      if (this.newPayment && this.newPayment.value > 0 && !this.errorAmount) {
        this.addingPayment = true;
        let params = {
          type: this.newPayment.type,
          amount: this.newPayment.value,
          ticket_id: this.ticket.id,
          client_id: this.ticket.client_id
        };
        this.addPayment(params)
          .then(response => {
            this.addingPayment = false;
            this.newPayment = { value: "", type: "Efectivo" };
            this.$refs.newPayment.focus();
          })
          .catch(error => {
            console.log(error);
            this.addingPayment = false;
          });
      }
    },
    setPending() {
      this.newPayment.value = this.pendingValue;
      this.$refs.newPayment.focus();
    },
    handlePayments(list) {
      this.selectedPayments = list.map(r => {
        return r.id;
      });
    }
  }
};
</script>

<style>
.ticket-payments-content {
  border-left: 1px solid #ddd;
}

.ticket-payments-content .error-message {
  margin: 0px -5px 5px -5px;
}

.ticket-payments-content .el-alert__closebtn.is-customed {
  color: #333;
}

.ticket-payments-content .payments-toolbar {
  height: 2.5em;
  line-height: 2.5em;
  border-top: solid 1px #d4d4d4;
  padding: 3px 10px;
  background: #fbfbfb;
}
.ticket-payments-content .payments-toolbar .reload-data {
  float: right;
}
.ticket-payments-content .payments-toolbar .toolbar {
  float: left;
}
.ticket-payments-content .payment-form {
  height: 3em;
  line-height: 3em;
  border-bottom: solid 1px #eee;
  padding: 5px;
}

.ticket-payments-content .paid {
  font-size: 20px;
  float: left;
  margin-left: 10px;
}
.ticket-payments-content .pending {
  font-size: 20px;
  float: right;
  margin-right: 10px;
}
.ticket-payments-content .pending .currency {
  color: #f56c6c;
}
.ticket-payments-content .pending .currency {
  color: #f56c6c;
}

.ticket-payments-content .el-select .el-input {
  width: 110px;
}
.ticket-payments-content .input-with-select .el-input-group__prepend {
  background-color: #fff;
}
.ticket-payments-content .el-table td .cell {
  line-height: 30px !important;
}
</style>
