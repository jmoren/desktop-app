<template>
  <div class="ticket-rows-content">
    <div class="ticket-toolbar top">
      <div v-if="!isModal">
        <div v-if="currentForm === 'item'"><ticket-item-form/></div>
        <div v-if="currentForm === 'promotion'"><ticket-promotion-form/></div>
      </div>
      <div v-if="currentForm === 'additional'"><ticket-additional-form/></div>
    </div>
    <div
      v-loading="loading"
      class="ticket-table">
      <el-table
        ref="entriesTable"
        :data="entries"
        class="entries"
        style="width: 100%"
        height="585"
        @selection-change="handleSelectionChange">
        <el-table-column
          label=""
          width="80">
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
        <el-table-column
          type="selection"
          width="55"/>
        <el-table-column
          label="Producto"
          width="500">
          <template slot-scope="scope">
            <el-row :gutter="5">
              <el-col
                :span="2"
                class="text-center">
                <span class="icon-round">
                  <font-awesome-icon
                    :icon="selectIcon(scope.row.item)"/>
                </span>
              </el-col>
              <el-col :span="12">
                <div>{{ scope.row.item.name }}</div>
              </el-col>
              <el-col
                :span="8"
                class="row-comment">
                <span
                  v-if="!scope.row.commentForm"
                  @dblclick="openCommentForm(scope.row)">
                  {{ scope.row.comment || 'Sin comentarios' }}
                </span>
              </el-col>
              <el-col
                :span="2"
                class="text-center">
                <span :class="rowState(scope.row)">
                  <font-awesome-icon icon="circle"/>
                </span>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column
          label="Tipo"
          width="100">
          <template slot-scope="scope">
            {{ scope.row.type }}
          </template>
        </el-table-column>
        <el-table-column
          label="Cant">
          <template slot-scope="scope">
            {{ scope.row.quantity }}
          </template>
        </el-table-column>
        <el-table-column
          label="Precio U.">
          <template slot-scope="scope">
            {{ scope.row.item.price }}
          </template>
        </el-table-column>
        <el-table-column
          label="Subtotal">
          <template slot-scope="scope">
            {{ scope.row.subtotal }}
          </template>
        </el-table-column>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <ul class="item-rows">
              <li
                v-for="(item, index) in scope.row.entry_items"
                :key="index">
                <a
                  href="#"
                  style="color: #F56C6C; margin-right: 10px">
                  <font-awesome-icon icon="trash"/>
                </a>
                {{ item.item_name }}
                <span
                  :class="entryState(item)"
                  class="row-item-icon">
                  <font-awesome-icon icon="circle"/>
                </span>
              </li>
            </ul>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div
      class="ticket-toolbar bottom"
      style="background: #fbfbfb;">
      <div class="reload-data">
        <el-button
          size="mini"
          type="primary"
          @click="loadEntries()">
          <font-awesome-icon icon="sync"/>
        </el-button>
      </div>
      <div
        v-if="multipleSelection.length > 0"
        class="toolbar">
        <el-button-group>
          <el-button
            size="mini"
            type="primary">
            <font-awesome-icon icon="thumbs-up"/>
            Entregar
          </el-button>
          <el-button
            size="mini"
            type="danger">
            <font-awesome-icon icon="trash"/>
            Cancelar
          </el-button>
        </el-button-group>
      </div>
    </div>
    <div class="ticket-toolbar bottom">
      <div style="float: left">
        <span>
          <span class="icon-round"><font-awesome-icon icon="calendar-alt"/></span>
          Creado el {{ ticket.created_at | moment('MM.DD.YYYY HH:mm') }}
        </span>
        <span style="margin: 0px 20px;"><font-awesome-icon icon="ellipsis-v"/></span>
        <span>
          <span class="icon-round"><font-awesome-icon icon="user"/></span>
          {{ ticket.user.name }} - {{ ticket.user.role }}
        </span>
      </div>
    </div>
    <el-dialog
      :modal="false"
      :visible.sync="isCommentOpen"
      :close-on-click-modal="false"
      title="Agregar comentario"
      @close="cancelCommentForm()">
      <el-input
        v-model="currentRow.comment"
        class="textarea"
        placeholder="Agregar comentario"/>
      <span slot="footer">
        <el-button
          type="primary"
          @click="saveComment()">Guardar</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import _ from "lodash";
import FontAwesomeIcon from "@fortawesome/vue-fontawesome";
import TicketItemForm from "@/components/Ticket/TicketContent/Clasico/TicketItemForm";
import TicketPromotionForm from "@/components/Ticket/TicketContent/Clasico/TicketPromotionForm";
import TicketAdditionalForm from "@/components/Ticket/TicketContent/Clasico/TicketAdditionalForm";
import { createNamespacedHelpers as namespace } from "vuex";

const { mapGetters: ticketGetters } = namespace("tickets");
const { mapGetters: entriesGetters, mapActions: entriesActions } = namespace(
  "entries"
);
const { mapGetters: productsGetters } = namespace("products");

export default {
  name: "TicketItems",
  components: {
    FontAwesomeIcon,
    TicketItemForm,
    TicketPromotionForm,
    TicketAdditionalForm
  },
  props: {
    isModal: {
      required: true,
      type: Boolean,
      default: () => {
        return true;
      }
    }
  },
  data() {
    return {
      loading: false,
      multipleSelection: [],
      isCommentOpen: false,
      currentForm: "item",
      currentRow: {}
    };
  },
  computed: {
    ...ticketGetters(["ticket"]),
    ...entriesGetters(["entries"]),
    ...productsGetters(["products"])
  },
  created() {
    this.loadEntries();
  },
  methods: {
    ...entriesActions(["fetchTicketEntries", "updateTicketEntry"]),
    loadEntries() {
      this.loading = true;
      this.fetchTicketEntries(this.ticket.id)
        .then(response => {
          this.loading = false;
        })
        .catch(error => {
          console.warn(error);
          this.loading = false;
        });
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.entriesTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.entriesTable.clearSelection();
      }
    },
    handleSelectionChange(rows) {
      this.multipleSelection = rows.map(r => {
        return r.id;
      });
    },
    rowState(row) {
      return row.delivered
        ? "delivered"
        : row.canceled
          ? "canceled"
          : "pending";
    },
    entryState(row) {
      return row.delivered_at
        ? "delivered"
        : row.canceled
          ? "canceled"
          : "pending";
    },
    showLine(row) {
      return row.canceled ? "hidden-row" : "";
    },
    selectIcon(item) {
      return item.zone === "cocina"
        ? "utensils"
        : item.zone === "barra"
          ? "beer"
          : "attach";
    },
    openCommentForm(row) {
      this.originalRow = row;
      this.currentRow = _.clone(row);
      this.isCommentOpen = true;
    },
    cancelCommentForm() {
      this.isCommentOpen = false;
      this.currentRow = this.originalRow;
    },
    saveComment(row) {
      let entry = {
        id: this.currentRow.id,
        comment: this.currentRow.comment,
        ticket_id: this.currentRow.ticket_id
      };
      this.updateTicketEntry(entry)
        .then(response => {
          console.log(response);
          this.currentRow = {};
          this.isCommentOpen = false;
        })
        .catch(error => {
          console.log(error);
        });
    },
    switchForm(type) {
      this.currentForm = type;
    }
  }
};
</script>

<style>
.ticket-rows-content {
  background: #fff;
}

.ticket-rows-content .item-rows {
  list-style-type: none;
  margin: 0px;
  padding: 0px 0px 0px 9.5em;
}
.ticket-rows-content .item-rows li.hidden-row {
  display: none;
}
.ticket-rows-content .item-rows li {
  height: 40px;
  line-height: 40px;
  width: 30.8em;
  border-bottom: dashed 1px #ddd;
}
.ticket-rows-content .item-rows li .row-item-icon {
  float: right;
}
.ticket-rows-content .item-rows li:last-child {
  border-bottom: none;
}

.ticket-rows-content .delivered {
  color: #67c23a;
}
.ticket-rows-content .pending {
  color: #e6a23c;
}
.ticket-rows-content .canceled {
  color: #f56c6c;
}
.ticket-rows-content .ticket-toolbar.bottom {
  height: 2.5em;
  line-height: 2.5em;
  border-top: solid 1px #d4d4d4;
  padding: 5.5px 10px;
  font-size: 14px;
  background: #fbfbfb;
}

.ticket-rows-content .ticket-toolbar.top {
  height: 3em;
  line-height: 3em;
  border-bottom: solid 1px #eee;
  padding: 5px 0px;
}
.ticket-rows-content .ticket-toolbar .reload-data {
  margin-right: 10px;
  float: right;
}
.ticket-rows-content .ticket-toolbar .toolbar {
  margin-left: 0px;
  float: left;
}
.ticket-rows-content .icon-round {
  border-radius: 50%;
  border: solid 1px #999;
  padding: 5px 7px;
  margin-right: 10px;
  line-height: 30px !important;
}
.ticket-rows-content .entries td .row-comment {
  color: #999;
  text-align: right;
  text-decoration: italic;
}
.ticket-rows-content .el-table.entries td .cell {
  line-height: 30px !important;
}
</style>
