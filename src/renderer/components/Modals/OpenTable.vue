<template>
  <el-dialog 
    :close-on-click-modal="false" 
    :before-close="closeModal" 
    :visible="modalOpen" 
    title="Seleccione Mesa para abrir">
    <div>
      <el-autocomplete
        :fetch-suggestions="filterTables"
        :trigger-on-focus="false"
        style="width: 100%"
        placeholder="Seleccione mesa"
        @select="selectTable">
        <i 
          slot="suffix" 
          class="el-input__icon el-icon-search"></i>
        <template slot-scope="{ item }">
          <div class="item-name">{{ item.description }}</div>
        </template>
      </el-autocomplete>
    </div>
    <p>Mesas: {{ tableList.length }}</p>
  </el-dialog>
</template>

<script>
import { createNamespacedHelpers as namespace } from "vuex";
const { mapGetters: tablesGetters, mapActions: tableActions } = namespace(
  "tables"
);

export default {
  name: "ModalOpenTable",
  data() {
    return {
      modalOpen: false
    };
  },
  computed: {
    ...tablesGetters(["tableList"]),
    availableTable() {
      return this.tableList.filter(t => {
        return t.status === "closed";
      });
    }
  },
  created() {
    this.openModal();
  },
  methods: {
    ...tableActions(["openTable"]),
    openModal() {
      this.modalOpen = true;
    },
    closeModal() {
      this.modalOpen = false;
      this.$emit("done");
    },
    selectTable(table) {
      this.openTable(table.id)
        .then(response => {
          let ticket = response.current;
          this.closeModal();
          this.$router.push({ name: "ticket", params: { id: ticket.id } });
        })
        .catch(error => {
          console.log(error);
        });
    },
    filterTables(query, cb) {
      let result = this.availableTable.filter(table => {
        return table.description.toLowerCase().match(query.toLowerCase());
      });
      cb(result);
    }
  }
};
</script>
