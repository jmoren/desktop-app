<template>
  <div class="ticket-rows-content">
    <div class="ticket-toolbar top">
      <div v-if="!isModal"><ticket-item-form></ticket-item-form></div>
    </div>
    <div class="ticket-table" v-loading="loading">
      <el-table
        ref="entriesTable"
        :data="entries"
        class="entries"
        style="width: 100%"
        height="600"
        @selection-change="handleSelectionChange">
        <el-table-column
          label=""
          width="80">
          <template slot-scope="scope">
            <div style="text-align: center;">
              <a href="#" style="color: #F56C6C">
                <font-awesome-icon icon="trash"></font-awesome-icon>
              </a>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="Producto"
          width="500">
          <template slot-scope="scope">
            <el-row :gutter="5">
              <el-col :span="2" class="text-center">
                <span class="icon-round">
                  <font-awesome-icon 
                    :icon="selectIcon(scope.row.item)">
                  </font-awesome-icon>
                </span>
              </el-col>
              <el-col :span="12">
                <div>{{ scope.row.item.name }}</div>
              </el-col>
              <el-col :span="8" class="row-comment">
                <span v-if="!scope.row.commentForm" @dblclick="openCommentForm(scope.row)">
                  {{ scope.row.comment || 'Sin comentarios'}}
                </span>
              </el-col>
              <el-col :span="2" class="text-center">
                <span :class="rowState(scope.row)">
                  <font-awesome-icon icon="circle"></font-awesome-icon>
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
              <li v-for="(item, index) in scope.row.entry_items" :key="index">
                <span :class="entryState(item)" class="row-item-icon">
                  <font-awesome-icon icon="circle"></font-awesome-icon>
                </span>
                {{ item.item_name }}
              </li>
            </ul>
          </template>
        </el-table-column>
      </el-table>    
    </div>
    <div class="ticket-toolbar bottom">
      <div class="reload-data">
        <el-button size="mini" type="primary" @click="loadEntries()">
          <font-awesome-icon icon="sync"></font-awesome-icon>
          Reload
        </el-button>
      </div>
      <div class="toolbar" v-if="multipleSelection.length > 0">
        <el-button-group>
          <el-button size="mini" type="primary">
            <font-awesome-icon icon="thumbs-up"></font-awesome-icon>
            Entregar
          </el-button>
          <el-button size="mini" type="danger">
            <font-awesome-icon icon="trash"></font-awesome-icon>
            Cancelar
          </el-button>
        </el-button-group>
      </div>
    </div>
    <div class="ticket-toolbar bottom">
      <div style="float: left">
        <span class="icon-round"><font-awesome-icon icon="calendar"></font-awesome-icon></span>
        {{ ticket.created_at | moment('MM/DD/YYYY HH:mm Z') }} - {{ ticket.updated_at | moment('MM/DD/YYYY HH:mm Z')}}
      </div>
      <div style="float: right">
        {{ ticket.user.name }} - {{ ticket.user.role }}
        <span class="icon-round"><font-awesome-icon icon="user"></font-awesome-icon></span>
      </div>
    </div>
    <el-dialog 
        :modal="false"
        title="Agregar comentario" :visible.sync="isCommentOpen"
        :close-on-click-modal="false"
        @close="cancelCommentForm()">
      <el-input class="textarea" v-model="currentRow.comment" placeholder="Agregar comentario"/>
      <span slot="footer">
        <el-button type="primary" @click="saveComment()">Guardar</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import _ from 'lodash'
  import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
  import TicketItemForm from '@/components/Ticket/TicketContent/TicketItemForm'
  import { createNamespacedHelpers as namespace } from 'vuex'

  const { mapGetters: ticketGetters, mapActions: ticketActions } = namespace('tickets')
  const { mapGetters: productsGetters } = namespace('products')

  export default {
    name: 'ticket-items',
    components: { FontAwesomeIcon, TicketItemForm },
    props: {
      isModal: {
        required: true,
        type: Boolean,
        default: () => {
          return true
        }
      }
    },
    data () {
      return {
        loading: false,
        multipleSelection: [],
        isCommentOpen: false,
        currentRow: {}
      }
    },
    computed: {
      ...ticketGetters(['ticket', 'entries']),
      ...productsGetters(['products'])
    },
    created () {
      this.loadEntries()
    },
    methods: {
      ...ticketActions(['fetchTicketEntries', 'updateTicketEntry']),
      loadEntries () {
        this.loading = true
        this.fetchTicketEntries(this.ticket.id).then(response => {
          this.loading = false
        }).catch(error => {
          console.warn(error)
          this.loading = false
        })
      },
      toggleSelection (rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.entriesTable.toggleRowSelection(row)
          })
        } else {
          this.$refs.entriesTable.clearSelection()
        }
      },
      handleSelectionChange (rows) {
        this.multipleSelection = rows.map((r) => {
          return r.id
        })
      },
      rowState (row) {
        return row.delivered ? 'delivered' : row.canceled ? 'canceled' : 'pending'
      },
      entryState (row) {
        return row.delivered_at ? 'delivered' : row.canceled ? 'canceled' : 'pending'
      },
      showLine (row) {
        return row.canceled ? 'hidden-row' : ''
      },
      selectIcon (item) {
        return item.zone === 'cocina' ? 'utensils' : item.zone === 'barra' ? 'beer' : 'attach'
      },
      openCommentForm (row) {
        this.originalRow = row
        this.currentRow = _.clone(row)
        this.isCommentOpen = true
      },
      cancelCommentForm () {
        this.isCommentOpen = false
        this.currentRow = this.originalRow
      },
      saveComment (row) {
        let entry = {
          id: this.currentRow.id,
          comment: this.currentRow.comment,
          ticket_id: this.currentRow.ticket_id
        }
        this.updateTicketEntry(entry).then((response) => {
          console.log(response)
          this.currentRow = {}
          this.isCommentOpen = false
        }).catch(error => {
          console.log(error)
        })
      }
    }
  }
</script>

<style>
  .ticket-rows-content {
    position: fixed;
    width: inherit;
    height: 100vh;
    overflow: scroll;
    left: 0;
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

  .ticket-rows-content .delivered { color: #67C23A; }
  .ticket-rows-content .pending { color: #E6A23C; }
  .ticket-rows-content .canceled { color: #F56C6C; }
  .ticket-rows-content .ticket-toolbar.bottom {
    height: 2.5em;
    line-height: 2.5em;
    border-top: solid 1px #d4d4d4;
    padding: 5.5px 10px;
    font-size: 14px;
    background: #f1f1f1;
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
    margin-left: 10px;
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
  .ticket-rows-content .el-table.entries td .cell { line-height: 30px !important; }
</style>
