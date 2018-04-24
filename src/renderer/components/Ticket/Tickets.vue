<template>
  <div v-loading="loading">
    <page-header>
      <div slot="title" >Ticket</div>
      <div slot="controls">
        <el-button-group>
          <el-button type="primary">Imprimir</el-button>
          <el-button type="primary">Cerrar</el-button>
          <el-button type="primary">Cancelar</el-button>
        </el-button-group>
        <el-button type="info" :loading="loading" @click="loadTickets()">
          <i class="el-icon-refresh"></i>
        </el-button>
      </div>
    </page-header>
    <page-content>
      <div slot="content">
        Aca van los tickets
      </div>
    </page-content>
  </div>
</template>

<script>
  import PageHeader from '@/components/Shared/PageHeader'
  import PageContent from '@/components/Shared/PageContent'
  import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
  
  export default {
    name: 'client',
    components: {
      PageContent,
      PageHeader,
      FontAwesomeIcon
    },
    data () {
      return {
        loading: false,
        tickets: {}
      }
    },
    created () {
      this.loadTickets()
    },
    methods: {
      loadTickets () {
        console.log('load tickets')
      }
    }
  }
</script>

<style>
  
</style>
