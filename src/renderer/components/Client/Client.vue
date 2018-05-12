<template>
  <div v-loading="loading">
    <page-header>
      <div slot="title" >Cliente {{ client.name }}</div>
      <div slot="controls">
        <el-button-group>
          <el-button type="primary">Tickets</el-button>
          <el-button type="primary">Cta corriente</el-button>
          <el-button type="primary">Credencial</el-button>
        </el-button-group>
        <el-button 
          :loading="loading" 
          type="info" 
          @click="reloadTables()">Recargar</el-button>
      </div>
    </page-header>
    <page-content>
      <div slot="content">
        {{ client }}
      </div>
    </page-content>
  </div>
</template>

<script>
import PageHeader from "@/components/Shared/PageHeader";
import PageContent from "@/components/Shared/PageContent";
import FontAwesomeIcon from "@fortawesome/vue-fontawesome";
import { createNamespacedHelpers as namespace } from "vuex";
const { mapActions: clientsActions } = namespace("clients");

export default {
  name: "Client",
  components: {
    PageContent,
    PageHeader,
    FontAwesomeIcon
  },
  data() {
    return {
      loading: false,
      client: {}
    };
  },
  watch: {
    $route: "loadClient"
  },
  created() {
    this.loadClient();
  },
  methods: {
    ...clientsActions(["fetchClient"]),
    loadClient() {
      console.log("load client", this.$route.params.id);
      this.loading = true;
      this.fetchClient(this.$route.params.id).then(
        response => {
          this.client = response.data;
          this.loading = false;
        },
        error => {
          console.log(error);
          this.loading = false;
        }
      );
    }
  }
};
</script>

<style>
</style>
