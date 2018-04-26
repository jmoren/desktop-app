<template>
  <div v-loading="loading">
    <div class="ticket-toolbar">
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
    <el-table
      ref="entriesTable"
      :data="entries"
      class="entries"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        label=""
        width="80">
        <template slot-scope="scope">
          <div style="text-align: center;">
            <span :class="rowState(scope.row)">
              <font-awesome-icon icon="circle"></font-awesome-icon>
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        label="Tipo"
        width="100">
        <template slot-scope="scope">
          {{ scope.row.type }}
        </template>
      </el-table-column>
      <el-table-column
        label="Producto"
        width="400">
        <template slot-scope="scope">
          <el-row :gutter="5">
            <el-col :span="4">
              <span class="icon-round">
                <font-awesome-icon icon="utensils"></font-awesome-icon>
              </span>
            </el-col>
            <el-col :span="20">
              <span>{{ scope.row.item.name }}</span>
              <p style="color: #999; font-size: 12px;">{{ scope.row.comment }}</p>
            </el-col>
          </el-row>
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
          <ul>
            <li v-for="(item, index) in scope.row.entry_items" :key="index">
              <span :class="rowState(item)">
                <font-awesome-icon icon="circle"></font-awesome-icon>
              </span>
              {{ item.item_name }}
            </li>
          </ul>
        </template>
      </el-table-column>
    </el-table>    
  </div>
</template>

<script>
  import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
  import { createNamespacedHelpers as namespace } from 'vuex'
  const { mapGetters: ticketGetters, mapActions: ticketActions } = namespace('tickets')
  const { mapGetters: productsGetters } = namespace('products')

  export default {
    name: 'ticket-items',
    components: { FontAwesomeIcon },
    data () {
      return {
        loading: false,
        multipleSelection: []
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
      ...ticketActions(['fetchTicketEntries']),
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
      }
    }
  }
</script>

<style>
  .ticket-middle .ticket-rows {
    height: 100vh;
    overflow: auto;
  }

  .ticket-middle .ticket-rows .delivered { color: #67C23A; }
  .ticket-middle .ticket-rows .pending { color: #E6A23C; }
  .ticket-middle .ticket-rows .canceled { color: #F56C6C; }
  .ticket-middle .ticket-rows .ticket-toolbar {
    margin: 20px 0px;
    height: 30px;
  }
  .ticket-middle .ticket-rows .ticket-toolbar .reload-data {
    margin-right: 10px;
    display: inline;
  }
  .ticket-middle .ticket-rows .ticket-toolbar .toolbar {
    margin-left: 10px;
    display: inline;
  }
  .ticket-middle .ticket-rows .icon-round {
    border-radius: 50%;
    border: solid 1px #999;
    padding: 5px 7px;
    margin-right: 10px;
    line-height: 30px !important;
  }

  .ticket-middle .ticket-rows .el-table.entries td { vertical-align: top !important; }
</style>
