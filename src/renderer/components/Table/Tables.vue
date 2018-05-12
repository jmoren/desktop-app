<template lang="html">
  <div class="main-content-view">
    <page-header>
      <div slot="title" >MESAS</div>
      <div slot="controls">
        <el-button-group>
          <el-button 
            type="primary" 
            @click="filterTables('open')">Abiertas</el-button>
          <el-button 
            type="primary" 
            @click="filterTables('closed')">Cerradas</el-button>
          <el-button 
            type="primary" 
            @click="filterTables('')">Todas</el-button>
        </el-button-group>
        <el-button 
          :loading="loading" 
          type="info" 
          @click="reloadTables()">Recargar</el-button>
      </div>
    </page-header>
    <page-content>
      <div slot="content">
        <div 
          v-loading="loading" 
          class="tables-content">
          <el-row>
            <el-col 
              v-for="(table, index) in tables" 
              :span="4" 
              :key="index" 
              class="table">
              <el-card 
                shadow="never" 
                style="border-radius: 0px;border-top: none; border-left: none; height: 135px;">
                <div :class="table.status">
                  <el-row :gutter="5" >
                    <a 
                      class="table-link" 
                      @click="showTable(table)">  
                      <el-col :span="8">
                        <span class="icon"><font-awesome-icon 
                          icon="utensils" 
                          size="4x"/></span>
                      </el-col>
                    </a>
                    <el-col 
                      v-if="table.current.id" 
                      :span="16" 
                      class="with-ticket">
                      <el-row :gutter="5">
                        <div style="font-size: 13px">
                          <div style="margin-bottom: 5px;"><i class="el-icon-bell"></i>Ticket</div>
                          <b>{{ table.current.number }}</b>
                        </div>
                        <div 
                          v-if="table.current.client.name" 
                          style="font-size: 13px; margin-top: 5px">
                          <i class="el-icon-circle-check"></i> 
                          {{ table.current.client.name }}
                        </div>
                      </el-row>
                    </el-col>
                  </el-row>
                  <el-row 
                    :gutter="5" 
                    style="margin-top: 10px;">
                    <el-col :span="24"><div class="name">{{ table.description }}</div></el-col>
                  </el-row>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </div>
    </page-content>
  </div>
</template>

<script>
import PageHeader from "@/components/Shared/PageHeader";
import PageContent from "@/components/Shared/PageContent";
import FontAwesomeIcon from "@fortawesome/vue-fontawesome";
import { createNamespacedHelpers as namespace } from "vuex";
const { mapGetters: tablesGetters, mapActions: tablesActions } = namespace(
  "tables"
);

export default {
  name: "Tables",
  components: { PageHeader, PageContent, FontAwesomeIcon },
  data() {
    return {
      loading: false,
      tableStatus: ""
    };
  },
  computed: {
    ...tablesGetters(["tableList"]),
    tables() {
      if (this.tableStatus) {
        return this.tableList.filter(
          table => table.status === this.tableStatus
        );
      } else {
        return this.tableList;
      }
    }
  },
  methods: {
    ...tablesActions(["fetchTables", "openTable"]),
    filterTables(status) {
      this.tableStatus = status;
    },
    reloadTables() {
      this.loading = true;
      this.fetchTables()
        .then(response => {
          this.loading = false;
        })
        .catch(error => {
          this.notify(error);
          this.loading = false;
        });
    },
    showTable(table) {
      if (table.current.id) {
        this.$router.push({ name: "ticket", params: { id: table.current.id } });
      } else {
        this.openTable(table.id)
          .then(response => {
            let ticket = response.current;
            this.$router.push({ name: "ticket", params: { id: ticket.id } });
          })
          .catch(error => {
            this.notify(error);
          });
      }
    },
    notify(error) {
      this.$notify({
        type: "error",
        title: "Error cargando mesas",
        message: error.data.message,
        position: "bottom-right"
      });
    }
  }
};
</script>

<style lang="css">
  .tables-content { background: #fff; }
  .tables-content .table .closed,
  .tables-content .table .closed a {
    color: #C70039;
  }

  .tables-content .table .open,
  .tables-content .table .open a {
    color: #333;
  }
  
  .tables-content .table .open .table-link,
  .tables-content .table .closed .table-link {
    height: 60px;
    line-height: 60px;
  }

  .tables-content .table {
    text-align: left;
    min-height: 136px;
    max-height: 136px;
  }
  .tables-content .table .with-ticket a { color: #C70039; text-decoration: none;}
  .tables-content .table .name {
    margin: 0px;
    padding: 0px;
  }

</style>
