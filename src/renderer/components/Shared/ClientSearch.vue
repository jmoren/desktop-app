<template>
  <div class="client-search" v-if="isOpen">
    <el-input 
      type="search"
      ref="clientSearch"
      placeholder="Buscar por nombre o telefono"
      v-model="criteria"
      :disabled="searching"
      @blur="search()">
      <i slot="prefix" class="el-input__icon el-icon-search"></i>
      <i v-if="searching" slot="suffix" class="el-input__icon el-icon-loading"></i>
    </el-input>
  </div>
</template>

<script>
  export default {
    name: 'search-form',
    data () {
      return {
        criteria: '',
        isOpen: false,
        searching: false
      }
    },
    methods: {
      open () {
        this.isOpen = true
        this.$nextTick(() => {
          this.$refs.clientSearch.focus()
        })
      },
      close () {
        this.isOpen = false
        this.criteria = ''
        this.searching = false
      },
      search () {
        if (this.criteria) {
          this.searching = true
          setTimeout(() => {
            this.searching = false
            this.isOpen = false
            this.criteria = ''
          }, 1000)
        } else {
          this.close()
        }
      }
    }
  }
</script>

<style scoped>
  .client-search {
    position: absolute;
    box-shadow: 3px 3px 3px #999;
    top: 71px;
    z-index: 1000;
    background: #f1f1f1;
    padding: 10px;
    left: 0;
    width: 50%;
  }

  .client-search .title { font-size: 15px; font-weight: bold; margin: 10px 0px; }
</style>
