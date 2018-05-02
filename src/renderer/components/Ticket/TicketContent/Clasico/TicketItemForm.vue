<template>
  <div class="ticket-form">
    <el-form @keyup.enter.prevent="addEntry">
      <el-row :gutter="10">
        <el-col :span="1">
          <span v-if="item.product.id" style="border: solid 1px #ddd; border-radius: 50%; padding: 8px 11px;">
            {{ getInitial(item.product.type) }}
          </span>
        </el-col>
        <el-col :span="3">
          <el-autocomplete 
            v-model="productCode" 
            :fetch-suggestions="filterProductsByCode"
            :trigger-on-focus="false"
            style="width: 100%"
            placeholder="Codigo"
            type="number"
            ref="codeInput"
            @select="setProduct">
            <i slot="suffix" class="el-input__icon el-icon-search"></i>
            <template slot-scope="{ item }">
              <div class="item-name">{{ item.code }}</div>
              <span class="item-description">{{ item.name }}</span>
            </template>
          </el-autocomplete>
        </el-col>
        <el-col :span="9">
          <el-autocomplete
            v-model="productName"
            :fetch-suggestions="filterProductsByName"
            :trigger-on-focus="false"
            style="width: 100%"
            clearable
            placeholder="Seleccione Producto"
            @select="setProduct">
            <i slot="suffix" class="el-input__icon el-icon-search"></i>
            <template slot-scope="{ item }">
              <div class="item-name">{{ item.name }}</div>
              <span class="item-description">{{ item.code }} - {{ item.description }}</span>
            </template>
          </el-autocomplete>
        </el-col>
        <el-col :span="2">
          <el-input type="number" placeholder="Cantidad" @change="updateSubTotal" v-model="item.quantity" min="1" step="1"/>
        </el-col>
        <el-col :span="6">
          <el-input type="text" placeholder="Nota o comentario" v-model="item.comment" @blur="addEntry()" />
        </el-col>
        <el-col :span="3">
          <el-button size="medium" type="danger" icon="el-icon-delete"></el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  import { createNamespacedHelpers as namespace } from 'vuex'
  const { mapGetters: productsGetters } = namespace('products')
  
  export default {
    name: 'ticket-items-form',
    data () {
      return {
        itemFormOpen: false,
        productCode: null,
        productName: null,
        item: {
          code: '',
          quantity: 1,
          subtotal: 0,
          product: {}
        }
      }
    },
    computed: {
      ...productsGetters(['itemList'])
    },
    created () {
      this.$nextTick(() => {
        this.$refs.codeInput.focus()
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
      setProduct (product) {
        this.item.product = product
        this.item.code = product.code
        this.productName = this.item.product.name
        this.productCode = String(this.item.product.code)
      },
      filterProductsByName (query, cb) {
        let result = this.itemList.filter((product) => {
          return product.name.toLowerCase().match(this.productName)
        })

        cb(result)
      },
      filterProductsByCode (query, cb) {
        let result = this.itemList.filter((product) => {
          let code = String(product.code)
          return code.match(this.productCode)
        })

        cb(result)
      },
      updateSubTotal () {
        let subtotal = Number(this.item.product.price) * Number(this.item.quantity)
        this.item.subtotal = subtotal
      },
      getInitial (value) {
        if (value) {
          if (value.length >= 2) {
            return value.substr(0, 2).toUpperCase()
          } else {
            return value.toUpperCase()
          }
        } else {
          return ''
        }
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
