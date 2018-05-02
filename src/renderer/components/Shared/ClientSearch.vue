<template>
  <div class="client-search" v-if="isOpen">
    <el-autocomplete ref="clientSearch"
      style="width: 100%" 
      :fetch-suggestions="search"
      @select="gotToClient"
      placeholder="Buscar cliente"
      v-model="criteria"
      :trigger-on-focus="false">
      <i slot="prefix" class="el-input__icon el-icon-search"></i>
      <template slot-scope="{ item }">
        <div class="value">{{ item.name }}</div>
        <span class="link">{{ item.phone }}</span>
      </template>
    </el-autocomplete>
  </div>
</template>

<script>
  import { createNamespacedHelpers as namespace } from 'vuex'
  const { mapActions: clientsActions } = namespace('clients')

  export default {
    name: 'search-form',
    data () {
      return {
        criteria: '',
        isOpen: true,
        clients: []
      }
    },
    methods: {
      ...clientsActions(['searchClient']),
      open () {
        if (this.isOpen) {
          this.close()
        } else {
          this.$nextTick(() => {
            this.$refs.clientSearch.focus()
          })
        }
      },
      close () {
        this.criteria = ''
      },
      search (query, cb) {
        if (this.criteria && this.criteria.length > 2) {
          this.searchClient(this.criteria).then(response => {
            cb(response.data)
          }).catch(error => {
            console.log(error)
          })
        }
      },
      gotToClient (client) {
        this.criteria = ''
        this.$router.push({ name: 'client', params: { id: client.id } })
      }
    }
  }
</script>

<style scoped>
  .client-search {
    /*position: absolute;
    box-shadow: 3px 3px 3px #999;
    top: 4.6em;
    left: 0;
    z-index: 1000;
    background: #f1f1f1;
    padding: 10px;*/
    width: 100%;
    height: 3em;
    line-height: 3em;
  }
  .my-autocomplete  li {
      line-height: normal;
      padding: 7px;
  }
  .my-autocomplete .value {
    text-overflow: ellipsis;
    overflow: hidden;
  }
 .my-autocomplete .link {
    font-size: 12px;
    color: #b4b4b4;
  }
  .client-search .title { font-size: 15px; font-weight: bold; margin: 10px 0px; }
</style>
