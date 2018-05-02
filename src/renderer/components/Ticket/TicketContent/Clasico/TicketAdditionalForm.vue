<template>
  <div class="ticket-form">
    <el-form @keyup.enter.prevent="addEntry">
      <el-row :gutter="10">
        <el-col :span="4">
          <el-select type="text" placeholder="Seleccione" ref="zoneInput" v-model="item.zone">
            <el-option value="cocina" label="Cocina"/>
            <el-option value="barra" label="Barra"/>
          </el-select>
        </el-col>
        <el-col :span="14">
          <el-input type="text" placeholder="Nota o comentario" v-model="item.comment"/>
        </el-col>
        <el-col :span="4">
          <el-input type="number" placeholder="Subtotal" v-model="item.subtotal" min="1" step="0.1" @blur="addEntry()"/>
        </el-col>
        <el-col :span="2">
          <el-button size="medium" type="danger" icon="el-icon-delete"></el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: 'ticket-additionals-form',
    data () {
      return {
        itemFormOpen: false,
        productCode: null,
        productName: null,
        item: {
          zone: '',
          quantity: 1,
          subtotal: 0.0
        }
      }
    },
    created () {
      this.$nextTick(() => {
        this.$refs.zoneInput.focus()
      })
    },
    methods: {
      open () {
        this.itemFormOpen = true
      },
      close () {
        this.itemFormOpen = false
      },
      addEntry () {
        console.log('add entry')
      },
      updateSubTotal () {
        let subtotal = Number(this.item.product.price) * Number(this.item.quantity)
        this.item.subtotal = subtotal
      }
    }
  }
</script>

<style>
  .ticket-form {
    text-align: left;
    padding-left: 10px;
  }
  .ticket-form .el-autocomplete-suggestion li {
    line-height: 20px;
    padding: 3px 5px;
  }
  .ticket-form .el-autocomplete-suggestion .el-scrollbar {
    width: 200px !important;
  } 
  .ticket-form .item-name { font-weight: bold; }
  .ticket-form .item-description { color: #999; font-size: 12px; }
</style>
